const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");
const { response } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ message: "Id inválido" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const likes = 0;

  const repositorio = { id: uuid(), title, url, techs, likes };

  repositories.push(repositorio);
  return response.status(200).json(repositorio);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorioIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositorioIndex < 0) {
    return response.status(400).json({ message: "id inválido" });
  }

  const { likes } = repositories[repositorioIndex];
  const repositorio = { id, title, url, techs, likes };

  repositories[repositorioIndex] = repositorio;

  return response.json(repositorio);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorioIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositorioIndex < 0) {
    return response.status(400).json({ message: "id inválido" });
  }

  repositories.splice(repositorioIndex, 1);

  response.status(204).send();
});
//POST /repositories/:id/like: A rota deve aumentar o número de likes do repositório específico escolhido através do id
// presente nos parâmetros da rota, a cada chamada dessa rota, o número de likes deve ser aumentado em 1;
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorioIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositorioIndex < 0) {
    return response.status(400).json({ message: "id inválido" });
  }

  const like = repositories.find((element) => element.id == id);

  const novoLike = like.likes + 1;

  repositories[repositorioIndex].likes = novoLike;

  return response.status(200).json(repositories[repositorioIndex]);
});

module.exports = app;
