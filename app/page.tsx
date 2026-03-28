'use client';
import { useState } from 'react';
import Label from '@/app/components/Label';
import Button from '@/app/components/Button';
import CardWithCode from './components/CardWithCode';
import EditableLabel from './components/EditableLabel';

export default function Home() {
  const [getPlazosResult, setGetPlazosResult] = useState<any>(null);
  const [getPlazoByIdResult, setGetPlazoByIdResult] = useState<any>(null);
  const [plazoId, setPlazoId] = useState<string>('');

  const defaultJson = JSON.stringify({
    numeroCuenta: "",
    tipoMoneda: "",
    monto: "",
    tasaAnual: "",
    fechaInicio: "",
    fechaVencimiento: ""
  }, null, 2);

  const defaultPutJson = JSON.stringify({
    numeroCuenta: "",
    tipoMoneda: "",
    monto: "",
    tasaAnual: "",
    fechaInicio: "",
    fechaVencimiento: "",
    estado: ""
  }, null, 2);

  const [postBody, setPostBody] = useState(defaultJson);
  const [postResult, setPostResult] = useState<any>(null);

  const [putPlazoId, setPutPlazoId] = useState<string>('');
  const [putBody, setPutBody] = useState(defaultPutJson);
  const [putResult, setPutResult] = useState<any>(null);

  const [deletePlazoId, setDeletePlazoId] = useState<string>('');
  const [deleteResult, setDeleteResult] = useState<any>(null);

  const handleGetPlazos = async () => {
    try {
      const res = await fetch('/api/plazos-fijos');
      const data = await res.json();
      setGetPlazosResult(data);
    } catch (error) {
      setGetPlazosResult({ error: String(error) });
    }
  };

  const handleGetPlazoById = async () => {
    if (!plazoId) return;
    try {
      const res = await fetch(`/api/plazos-fijos/${plazoId}`);
      const data = await res.json();
      setGetPlazoByIdResult(data);
    } catch (error) {
      setGetPlazoByIdResult({ error: String(error) });
    }
  };

  const handlePostPlazos = async () => {
    try {
      const parsedBody = JSON.parse(postBody);
      const res = await fetch('/api/plazos-fijos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedBody)
      });
      const data = await res.json();
      setPostResult(data);
    } catch (error) {
      setPostResult({ error: String(error) });
    }
  };

  const handlePutPlazos = async () => {
    if (!putPlazoId) return;
    try {
      const parsedBody = JSON.parse(putBody);
      const res = await fetch(`/api/plazos-fijos/${putPlazoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedBody)
      });
      const data = await res.json();
      setPutResult(data);
    } catch (error) {
      setPutResult({ error: String(error) });
    }
  };

  const handleDeletePlazo = async () => {
    if (!deletePlazoId) return;
    try {
      const res = await fetch(`/api/plazos-fijos/${deletePlazoId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      setDeleteResult(data);
    } catch (error) {
      setDeleteResult({ error: String(error) });
    }
  };

  return (
    <>
      <header className="flex flex-col gap-4">
        <Label className="text-xl">API Plazo Fijo - Ejercicio 4</Label>
        <Label>Postulante: Götte, Brian Nahuel</Label>
      </header>
      <main className="mt-8">
        <Label className="text-lg">Endpoints disponibles</Label>
        <section className="mt-4">
          <Label className="text-md">GET /api/plazos-fijos</Label>
          <p>Obtiene la lista de plazos fijos registrados.</p>
          <Button onClick={handleGetPlazos}>Probar</Button>
          {getPlazosResult && <CardWithCode data={getPlazosResult} />}
        </section>
        <section className="mt-4">
          <Label className="text-md">GET /api/plazos-fijos/{"{"}id{"}"}</Label>
          <p>Obtiene un plazo fijo por su ID.</p>
          <div className="flex flex-row gap-4 items-center">
            <EditableLabel placeholder="ID" onChange={setPlazoId} />
            <Button onClick={handleGetPlazoById}>Probar</Button>
          </div>
          {getPlazoByIdResult && <CardWithCode data={getPlazoByIdResult} />}
        </section>
        <section className="mt-4">
          <Label className="text-md">POST /api/plazos-fijos</Label>
          <p>Crea un nuevo plazo fijo.</p>
          <div className="flex flex-col gap-2">
            <textarea
              className="w-full h-48 p-2 text-sm font-mono border rounded"
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
            />
            <div className="flex">
              <Button onClick={handlePostPlazos}>Probar POST</Button>
            </div>
          </div>
          {postResult && <CardWithCode data={postResult} />}
        </section>
        <section className="mt-4">
          <Label className="text-md">PUT /api/plazos-fijos/{"{"}id{"}"}</Label>
          <p>Actualiza un plazo fijo existente.</p>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4 items-center">
              <EditableLabel placeholder="ID a actualizar" onChange={setPutPlazoId} />
            </div>
            <textarea
              className="w-full h-48 p-2 text-sm font-mono border rounded"
              value={putBody}
              onChange={(e) => setPutBody(e.target.value)}
            />
            <div className="flex">
              <Button onClick={handlePutPlazos}>Probar PUT</Button>
            </div>
          </div>
          {putResult && <CardWithCode data={putResult} />}
        </section>
        <section className="mt-4">
          <Label className="text-md">DELETE /api/plazos-fijos/{"{"}id{"}"}</Label>
          <p>Elimina un plazo fijo por su ID.</p>
          <div className="flex flex-row gap-4 items-center">
            <EditableLabel placeholder="ID a eliminar" onChange={setDeletePlazoId} />
            <Button onClick={handleDeletePlazo}>Probar DELETE</Button>
          </div>
          {deleteResult && <CardWithCode data={deleteResult} />}
        </section>
      </main>
    </>
  );
}
