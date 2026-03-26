//app/api/plazos-fijos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPlazosFijos, deletePlazoFijo, updatePlazoFijo } from '@/lib/plazoFijo';
import { ValidationError } from '@/lib/errors';
import type { addPlazoFijoDTO } from '@/lib/types.d.ts';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) { 
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    //Validaciones
    if (isNaN(id) || id <= 0) {
      throw new ValidationError('El ID ingresado no es válido');
    }

    const rows = await getPlazosFijos(id);
    if(!rows) {
      return NextResponse.json({ message: "No se encontró el plazo fijo" }, { status: 404 });
    }
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error(err);
    if(err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }else{
      return NextResponse.json({ error: "Lo sentimos, ha ocurrido un error." }, { status: 500 });
    }
  }  
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const idPlazoFijo = parseInt(resolvedParams.id);
    if (!idPlazoFijo || isNaN(idPlazoFijo)) {
      throw new ValidationError('El ID ingresado no es válido');
    }

    const body: addPlazoFijoDTO = await req.json();

    if (!body.numeroCuenta || !body.tipoMoneda || body.monto === undefined || body.tasaAnual === undefined || !body.fechaInicio || !body.fechaVencimiento || !body.estado) {
      throw new ValidationError("Faltan campos obligatorios para actualizar el plazo fijo");
    }

    const result = await updatePlazoFijo(idPlazoFijo, body);
    if (!result) {
      throw new Error('No se pudo actualizar el plazo fijo');
    }

    return NextResponse.json({ message: "Plazo fijo actualizado exitosamente" }, {status: 200});
  } catch (err: any) {
    console.error(err);
    if(err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: "Lo sentimos, ha ocurrido un error." }, { status: 500 });
    }
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const idPlazoFijo = parseInt(resolvedParams.id);
    if (!idPlazoFijo) {
      throw new ValidationError('El ID ingresado no es válido');
    }
    const result = await deletePlazoFijo(idPlazoFijo);
    if(!result) {
      throw new Error('No se pudo eliminar el plazo fijo');
    } else {
      return NextResponse.json({ message: "Plazo fijo eliminado exitosamente" }, { status: 200 });
    }
  } catch (err: any) {
    console.error(err);
    if(err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }else{
      return NextResponse.json({ error: "Lo sentimos, ha ocurrido un error." }, { status: 500 });
    }
  }  
}

export async function PATCH(req: NextRequest) {
  // No se especifica en los requerimientos la implementación de PATCH
  return NextResponse.json({ error: "No implementado." }, { status: 501 });
}