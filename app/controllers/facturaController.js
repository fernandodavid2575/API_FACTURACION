const db = require("../config/db.config.js");
const Factura = db.Factura;
const DetalleFactura = db.DetalleFactura;
const Producto = db.Producto;
const Cliente = db.Cliente;

// ==================== CREAR FACTURA ====================
// Recibe: dpi_cliente, dpi_usuario, detalles: [{ codigo_producto, cantidad }]
// Lógica: valida stock, calcula subtotales y total, descuenta stock, crea factura + detalles
exports.crearFactura = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { dpi_cliente, dpi_usuario, detalles } = req.body;

    // Validar que vengan detalles
    if (!detalles || detalles.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "La factura debe tener al menos un producto." });
    }

    // Validar que el cliente exista
    const cliente = await Cliente.findByPk(dpi_cliente, { transaction: t });
    if (!cliente) {
      await t.rollback();
      return res.status(404).json({ message: "Cliente no encontrado con DPI: " + dpi_cliente });
    }

    // Generar número de factura único (FAC-timestamp-random)
    const numero_factura = "FAC-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    let subtotal = 0;
    const detallesProcesados = [];

    // Procesar cada línea de detalle
    for (const linea of detalles) {
      const producto = await Producto.findOne({
        where: { codigo_producto: linea.codigo_producto },
        transaction: t
      });

      if (!producto) {
        await t.rollback();
        return res.status(404).json({ message: "Producto no encontrado con código: " + linea.codigo_producto });
      }

      if (producto.stock_actual_producto < linea.cantidad) {
        await t.rollback();
        return res.status(400).json({
          message: "Stock insuficiente para el producto: " + producto.nombre_producto,
          stock_disponible: producto.stock_actual_producto,
          cantidad_solicitada: linea.cantidad
        });
      }

      const precio = parseFloat(producto.precio_unitario_producto);
      const lineaSubtotal = precio * linea.cantidad;
      subtotal += lineaSubtotal;

      // Descontar stock
      await producto.update(
        { stock_actual_producto: producto.stock_actual_producto - linea.cantidad },
        { transaction: t }
      );

      detallesProcesados.push({
        codigo_producto_detalle_factura: linea.codigo_producto,
        cantidad_detalle_factura: linea.cantidad,
        precio_unitario_detalle_factura: precio
      });
    }

    const total = subtotal; // Acá se podría agregar IVA u otros impuestos si se necesita

    // Crear la factura
    const factura = await Factura.create({
      dpi_cliente_factura: dpi_cliente,
      dpi_usuario_factura: dpi_usuario,
      numero_factura: numero_factura,
      fecha_emision_factura: new Date(),
      fecha_vencimiento_factura: null,
      estado_factura: "EMITIDA",
      subtotal_factura: subtotal,
      total_factura: total,
      moneda_factura: "GTQ",
      fecha_creacion_factura: new Date(),
      fecha_actualizacion_factura: new Date()
    }, { transaction: t });

    // Crear los detalles vinculados a la factura
    for (const detalle of detallesProcesados) {
      await DetalleFactura.create({
        id_factura_detalle_factura: factura.id_factura,
        ...detalle
      }, { transaction: t });
    }

    // Confirmar transacción
    await t.commit();

    res.status(201).json({
      message: "Factura creada exitosamente",
      factura: factura,
      detalles: detallesProcesados,
      subtotal: subtotal,
      total: total
    });

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Error al crear la factura", error: error.message });
  }
};

// ==================== OBTENER TODAS LAS FACTURAS ====================
exports.obtenerFacturas = async (req, res) => {
  try {
    const facturas = await Factura.findAll({
      order: [["fecha_emision_factura", "DESC"]]
    });

    res.status(200).json({
      message: "Facturas obtenidas exitosamente",
      facturas: facturas
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener facturas", error: error.message });
  }
};

// ==================== OBTENER FACTURA POR ID (con detalles) ====================
exports.obtenerFacturaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const factura = await Factura.findByPk(id);
    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrada con ID: " + id });
    }

    const detalles = await DetalleFactura.findAll({
      where: { id_factura_detalle_factura: id }
    });

    res.status(200).json({
      message: "Factura obtenida exitosamente",
      factura: factura,
      detalles: detalles
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la factura", error: error.message });
  }
};

// ==================== OBTENER FACTURAS POR CLIENTE ====================
exports.obtenerFacturasPorCliente = async (req, res) => {
  try {
    const { dpi } = req.params;

    const facturas = await Factura.findAll({
      where: { dpi_cliente_factura: dpi },
      order: [["fecha_emision_factura", "DESC"]]
    });

    res.status(200).json({
      message: "Facturas del cliente obtenidas exitosamente",
      facturas: facturas
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener facturas del cliente", error: error.message });
  }
};

// ==================== ANULAR FACTURA ====================
// Anular devuelve el stock de los productos
exports.anularFactura = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { id } = req.params;

    const factura = await Factura.findByPk(id, { transaction: t });
    if (!factura) {
      await t.rollback();
      return res.status(404).json({ message: "Factura no encontrada con ID: " + id });
    }

    if (factura.estado_factura === "ANULADA") {
      await t.rollback();
      return res.status(400).json({ message: "La factura ya está anulada." });
    }

    // Obtener detalles para devolver stock
    const detalles = await DetalleFactura.findAll({
      where: { id_factura_detalle_factura: id },
      transaction: t
    });

    // Devolver stock de cada producto
    for (const detalle of detalles) {
      const producto = await Producto.findOne({
        where: { codigo_producto: detalle.codigo_producto_detalle_factura },
        transaction: t
      });
      if (producto) {
        await producto.update(
          { stock_actual_producto: producto.stock_actual_producto + detalle.cantidad_detalle_factura },
          { transaction: t }
        );
      }
    }

    // Cambiar estado a ANULADA
    await factura.update({
      estado_factura: "ANULADA",
      fecha_actualizacion_factura: new Date()
    }, { transaction: t });

    await t.commit();

    res.status(200).json({
      message: "Factura anulada exitosamente. Stock devuelto.",
      factura: factura
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Error al anular la factura", error: error.message });
  }
};

// ==================== CAMBIAR ESTADO DE FACTURA ====================
// Estados válidos: EMITIDA, PAGADA, ANULADA
exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ["EMITIDA", "PAGADA", "ANULADA"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        message: "Estado no válido. Los estados permitidos son: " + estadosValidos.join(", ")
      });
    }

    const factura = await Factura.findByPk(id);
    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrada con ID: " + id });
    }

    if (factura.estado_factura === "ANULADA") {
      return res.status(400).json({ message: "No se puede cambiar el estado de una factura anulada." });
    }

    await factura.update({
      estado_factura: estado,
      fecha_actualizacion_factura: new Date()
    });

    res.status(200).json({
      message: "Estado de factura actualizado a: " + estado,
      factura: factura
    });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar estado de factura", error: error.message });
  }
};
