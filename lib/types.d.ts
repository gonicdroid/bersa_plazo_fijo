export type plazoFijoDTO = {
    id: number,
    numeroCuenta: string,
    tipoMoneda: string,
    monto: number,
    tasaAnual: number,
    fechaInicio: string,
    fechaVencimiento: string,
    plazoDias: number,
    interesCalculado: number,
    montoFinal: number,
    estado: string
};

export type addPlazoFijoDTO = Omit<plazoFijoDTO, 'id' | 'plazoDias' | 'interesCalculado' | 'montoFinal'>;

export type plazoFijoDBQuery = addPlazoFijoDTO & {
    id: number,
    idCuenta: number,
    idMoneda: number,
    idEstado: number,
    nombreEstado: string
}
