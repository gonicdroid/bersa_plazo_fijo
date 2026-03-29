//app/api/plazos-fijos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPlazosFijos, addPlazoFijo } from '@/lib/plazoFijo';
import { ValidationError } from '@/lib/errors';
import type { addPlazoFijoDTO } from '@/lib/types.d.ts';

export async function GET(req: NextRequest) { 
  try {
    const rows = await getPlazosFijos();
    if(!rows) {
      return NextResponse.json({ message: "No se encontraron plazos fijos" }, { status: 404 });
    }
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: "Lo sentimos, ha ocurrido un error." }, { status: 500 });
  }  
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { numeroCuenta, tipoMoneda, monto, tasaAnual, fechaInicio, fechaVencimiento } = data;
    if (!numeroCuenta || !tipoMoneda || monto === undefined || tasaAnual === undefined || !fechaInicio || !fechaVencimiento) {
      throw new ValidationError('Faltan datos obligatorios');
    }
    const montoNum = parseFloat(monto);
    const tasaAnualNum = parseFloat(tasaAnual);
    const result = await addPlazoFijo(
      {
        numeroCuenta,
        tipoMoneda,
        monto: montoNum,
        tasaAnual: tasaAnualNum,
        fechaInicio,
        fechaVencimiento
      } as addPlazoFijoDTO);
    if(!result.status) {
      throw new Error('No se pudo crear el plazo fijo');
    }
    return NextResponse.json({ message: "Plazo fijo creado exitosamente", id: result.id }, { status: 201 });
  } catch (error: any) {
    if(error instanceof ValidationError) {
      return NextResponse.json({error: error.message }, { status: 400 });
    }
    return NextResponse.json({error: 'No se pudo crear el plazo fijo' }, { status: 500 });
  }
}