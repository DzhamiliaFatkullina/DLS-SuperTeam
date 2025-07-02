import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

models = {
    'all_mpnet_base_v2': None,
    'all_MiniLM_L12_v2': None,
    'multi_qa_distilbert_cos_v1': None
}

embeddings = {}
emb_matrices = {}
for model_name in models:
    emb_path = f"embeddings/embeddings_{model_name.replace('-', '_')}.npy"
    embeddings[model_name] = np.load(emb_path)
    models[model_name] = SentenceTransformer(model_name.replace("_", "-"))
    emb_matrix = embeddings[model_name] / np.linalg.norm(embeddings[model_name], axis=1, keepdims=True)
    emb_matrices[model_name] = emb_matrix

movie_titles = pd.read_csv("final_dataset.csv")['title'].tolist()
movie_plots = pd.read_csv("final_dataset.csv")['plot'].tolist()
movie_genres = pd.read_csv("final_dataset.csv")['genres'].tolist()

app = FastAPI(
    title="VoiceDiaryML",
    description="ML part for emotion recognition",
    version="0.1.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def get_movies(query: str, model_name: str, top_k: int = 5) -> list[dict[str, str | list[str]]]:
    model = models[model_name]
    emb_matrix = emb_matrices[model_name]

    query_emb = model.encode([query])
    scores = np.dot(emb_matrix, query_emb.T).flatten()
    top_indices = np.argsort(scores)[-top_k:][::-1]
    return [
        {
            "title": movie_titles[i],
            "plot": movie_plots[i],
            "genres": eval(movie_genres[i]),
        } for i in top_indices
    ]
