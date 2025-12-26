import useSWR from "swr";

function StatusPage() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2 * 1000, // 2 seconds
  });

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt data={data} isLoading={isLoading} />
      <h2>Database</h2>
      <DatabaseInfo data={data} isLoading={isLoading} />
    </>
  )
}

async function fetchAPI(key) {
  const response = await fetch(key);
  const body = await response.json();

  return body;
}


function UpdatedAt(props) {
  return (
    <div>
      {props.isLoading ? "Carregando..." : (
        <>
          <p>Última atualização: {new Date(props.data.updated_at).toLocaleString("pt-BR")}</p>
        </>
      )}
    </div>
  );
}

function DatabaseInfo(props) {
  return (
    <div>
      {props.isLoading ? "Carregando..." : (
        <>
          <p>Versão: {props.data.dependencies.database.version}</p>
          <p>Conexões abertas: {props.data.dependencies.database.opened_connections}</p>
          <p>Máximo de conexões: {props.data.dependencies.database.max_connections}</p>
        </>
      )}
    </div>
  );
}

export default StatusPage;
