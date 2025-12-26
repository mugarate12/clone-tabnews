import useSWR from "swr";

function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
    </>
  )
}

async function fetchAPI(key) {
  const response = await fetch(key);
  const body = await response.json();

  return body;
}


function UpdatedAt() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2 * 1000, // 2 seconds
  });

  return (
    <div>
      {isLoading ? "Carregando..." : (
        <>
          <p>Versão: {data.dependencies.database.version}</p>
          <p>Conexões abertas: {data.dependencies.database.opened_connections}</p>
          <p>Máximo de conexões: {data.dependencies.database.max_connections}</p>
          <p>Última atualização: {new Date(data.updated_at).toLocaleString("pt-BR")}</p>
        </>
      )}
    </div>
  );
}

export default StatusPage;
