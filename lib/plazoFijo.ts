//lib/plazoFijo.ts
import { query } from '@/lib/db'
import { ValidationError } from '@/lib/errors';
import type { addPlazoFijoDTO, plazoFijoDBQuery } from '@/lib/types.d.ts';

export async function getPlazosFijos(id?: number){
  try{
    let sql = `
      SELECT p.id, p.monto, p.tasaAnual, p.fechaInicio, 
      p.fechaVencimiento, c.idCuenta, c.numeroCuenta, m.tipoMoneda, e.nombreEstado 
      FROM plazosFijos p 
      INNER JOIN cuentas c ON p.idCuenta = c.idCuenta
      INNER JOIN monedas m ON c.idMoneda = m.idMoneda
      INNER JOIN estadosPlazoFijo e on p.idEstado = e.idEstado
      `;
    let rows;
    if(id){
      sql += " WHERE p.id = ?";
      rows = await query(sql, [id]);
      if(rows.length === 0) { return null; }
      return formatGetPlazoFijo(rows[0]);
    } else {
      rows = await query(sql);
      if(rows.length === 0) { return null; }
      return rows.map(formatGetPlazoFijo);
    }

  }catch (err) {
    throw err;
  }
}

function formatGetPlazoFijo(data: plazoFijoDBQuery){
  const plazoDiasCalc = calcularPlazoDias(data.fechaInicio, data.fechaVencimiento);
  const interesCalc = calcularInteres(data.monto, data.tasaAnual, plazoDiasCalc);
  const montoFinalCalc = calcularMontoFinal(data.monto, interesCalc);
  
  const formatYMD = (d: any) => {
    const date = new Date(d);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return {
    "id": data.id,
    "numeroCuenta": data.numeroCuenta,
    "tipoMoneda": data.tipoMoneda,
    "monto": data.monto,
    "tasaAnual": data.tasaAnual,
    "fechaInicio": formatYMD(data.fechaInicio),
    "fechaVencimiento": formatYMD(data.fechaVencimiento),
    "plazoDias": plazoDiasCalc,
    "interesCalculado": interesCalc,
    "montoFinal": montoFinalCalc,
    "estado": data.nombreEstado
  }
};

export async function addPlazoFijo(data: addPlazoFijoDTO) : Promise<{status: boolean, id: number}>{
  try{
    // Validaciones
    if (data.monto < 1) throw new ValidationError("El monto debe ser mayor a cero");
    if (data.tasaAnual <= 0 || data.tasaAnual > 200) throw new ValidationError("La tasa anual debe ser un valor entre 1 y 200, ambos inclusive.");
    calcularPlazoDias(data.fechaInicio, data.fechaVencimiento);
    const idEstado = await validarEstado(data.estado);
    const idMoneda = await validarMoneda(data.tipoMoneda);
    const idCuenta = await validarCuenta(data.numeroCuenta, idMoneda);
    
    const rows = await query(
      "INSERT INTO plazosFijos (idCuenta, monto, tasaAnual, fechaInicio, fechaVencimiento, idEstado) VALUES (?, ?, ?, ?, ?, ?)", 
      [idCuenta, data.monto, data.tasaAnual, data.fechaInicio, data.fechaVencimiento, idEstado]);
    
    if (rows.affectedRows === 0){
      return {status: false, id: 0};
    };
    return {status: true, id: Number(rows.insertId)}; 
  }catch (err) {
    throw err;
  }
}

export async function updatePlazoFijo(id: number, data: addPlazoFijoDTO): Promise<boolean> {
  // Requiere el objeto completo, siguiendo convención API REST (método PUT)
  try {
    // Validaciones
    if (data.monto < 1) throw new ValidationError("El monto debe ser mayor a cero");
    if (data.tasaAnual <= 0 || data.tasaAnual > 200) throw new ValidationError("La tasa anual debe ser un valor entre 1 y 200, ambos inclusive.");
    calcularPlazoDias(data.fechaInicio, data.fechaVencimiento);
    const idEstado = await validarEstado(data.estado);
    const idMoneda = await validarMoneda(data.tipoMoneda);
    const idCuenta = await validarCuenta(data.numeroCuenta, idMoneda);
    
    const rows = await query(
      "UPDATE plazosFijos SET idCuenta = ?, monto = ?, tasaAnual = ?, fechaInicio = ?, fechaVencimiento = ?, idEstado = ? WHERE id = ?",
      [idCuenta, data.monto, data.tasaAnual, data.fechaInicio, data.fechaVencimiento, idEstado, id]
    );

    if (rows.affectedRows === 0) {
      return false;
    }
    return true;
  } catch (err) {
    throw err;
  }
}

export async function deletePlazoFijo(id: number): Promise<boolean> {
  try {
    const result = await query("DELETE FROM plazosFijos WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (err) {
    throw err;
  }
}

function calcularPlazoDias(fechaInicio: string, fechaVencimiento: string): number {
  const inicio = new Date(fechaInicio);
  const vencimiento = new Date(fechaVencimiento);
  const diffTime = ( vencimiento.getTime() - inicio.getTime() );
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
  if (diffDays <= 0 || diffDays > 365) throw new ValidationError("El plazo en días debe ser un valor entre 1 y 365, ambos inclusive.");
  return diffDays;
}

function calcularInteres(monto: number, tasaAnual: number, plazoDias: number): number {
  return Math.ceil(((Number(monto) * Number(tasaAnual) * Number(plazoDias)) / (365 * 100)) * 100) / 100;
}

function calcularMontoFinal(monto: number, interesCalculado: number): number {
  return Math.ceil((Number(monto) + Number(interesCalculado)) * 100) / 100;
}

async function validarMoneda(tipoMoneda: string): Promise<number> {
    // Monedas: verifico existencia
    const moneda = await query("SELECT idMoneda, tipoMoneda FROM monedas WHERE tipoMoneda = ?", [tipoMoneda.toUpperCase()]);
    if (moneda.length === 0) throw new ValidationError("La moneda especificada no está disponible.");
    return moneda[0].idMoneda;
}

async function validarCuenta(numeroCuenta: string, idMoneda: number){
  try{
    // Limpieza del numero de cuenta
    let cuentaLimpia = String(numeroCuenta).replace(/\D/g, '')
    if(cuentaLimpia.length === 0) throw new ValidationError("El número de cuenta debe contener al menos un dígito.");
    let cuenta = await query("SELECT idCuenta, numeroCuenta, idMoneda FROM cuentas WHERE numeroCuenta = ? LIMIT 1", [cuentaLimpia]);
    let idCuentaFinal;
    if (cuenta.length === 0) {
      // Si la cuenta no existe
      const nuevaCta = await query("INSERT INTO cuentas (numeroCuenta, idMoneda) VALUES (?, ?)", [cuentaLimpia, idMoneda]);
      idCuentaFinal = Number(nuevaCta.insertId);
    } else {
      if (cuenta[0].idMoneda !== idMoneda) throw new ValidationError("La moneda de la cuenta no coincide con la moneda del plazo fijo.");
      idCuentaFinal = cuenta[0].idCuenta;
    }
    return idCuentaFinal;
  }catch (err) {
    throw err;
  }
}

const validarEstado = async (nombreEstado?: string): Promise<number> => {
  // Si no se pasa estado, entonces devuelvo el id por defecto del estado "Activo"
  let idEstado: number;

  if (nombreEstado) {
    const estadoResult = await query("SELECT idEstado FROM estadosPlazoFijo WHERE nombreEstado = ?", [nombreEstado.toUpperCase()]);
    if (estadoResult.length === 0) throw new ValidationError("El estado especificado no existe.");
    idEstado = estadoResult[0].idEstado;
  } else {
    const estadoActivo = await query("SELECT idEstado FROM estadosPlazoFijo WHERE nombreEstado = ? LIMIT 1", ["ACTIVO"]);
    idEstado = estadoActivo[0].idEstado;
  }

  return idEstado
}