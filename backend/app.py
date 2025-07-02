import numpy as np
import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

models = {
    'all_mpnet_base_v2': None,
    'all_MiniLM_L12_v2': None,
    'multi_qa_distilbert_cos_v1': None
}

embeddings = {}
for model_name in models:
    emb_path = f"embeddings/embeddings_{model_name.replace('-', '_')}.npy"
    embeddings[model_name] = np.load(emb_path)
    models[model_name] = SentenceTransformer(model_name.replace("_", "-"))

indexes = {}
for model_name in models:
    emb_matrix = embeddings[model_name]
    dimension = emb_matrix.shape[1]
    index = faiss.IndexFlatIP(dimension)
    index.add(emb_matrix.astype('float32'))
    indexes[model_name] = index

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
    index = indexes[model_name]
    model = models[model_name]
    query_emb = model.encode([query])
    distances, indices = index.search(query_emb.astype('float32'), top_k)
    return [
        {
            "title": movie_titles[i],
            "plot": movie_plots[i],
            "genres": eval(movie_genres[i]),
        } for i in indices[0]
    ]
