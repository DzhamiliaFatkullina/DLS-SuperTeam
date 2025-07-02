# MoviePlot Search: A Semantic Movie Discovery Engine
## Introduction

This project introduces a semantic search engine that helps users find movies by describing themes, storylines, or plot elements in natural language—for example, *"a post-apocalyptic world where AI controls humans."*

Unlike traditional keyword-based search, our system uses deep learning to understand the meaning behind queries and movie plots. This allows it to return more relevant and meaningful results.

We created a large dataset by combining and cleaning several public sources. The final dataset contains over _50,000_ movies from around the world, with information on titles, genres, and plot summaries.

To find the best way to match queries with movies, we tested **_3_** different sentence embedding models and **_5_** similarity methods.

Our results show that using the `all-mpnet-base-v2` model with cosine similarity gave the most accurate and relevant search results.

Finally, we built a simple application interface so users can easily search and explore movies using natural language descriptions.


## Dataset

For this project, we combined data from four high-quality datasets that include detailed movie plots, along with one additional dataset used to fill in missing genre information. The main goal was to create a unified dataset with consistent formatting and complete information.

### Data Preparation

- We merged the datasets by keeping only three columns: **plot**, **title**, and **genres**.
- Genres were standardized into lists. Where genre information was missing, we imputed it using the additional dataset.
- We ensured that each movie in the final dataset is unique and contains no null values.
- Initially, our combined dataset had approximately 42,000 movie plots.
- To further enrich the dataset, we used a fifth dataset sorted by plots not already included and by the longest overview length. We then added these additional movies to expand the dataset.

### Final Dataset

The resulting dataset contains over **50,000** movies from various sources worldwide, with clean and consistent information on plots, titles, and genres. This unified dataset serves as the foundation for training and evaluating our semantic search engine.

### **Source Datasets**  
| Dataset | Link |  
|---------|------|  
| Top Rated Movies | [Kaggle](https://www.kaggle.com/datasets/suvroo/top-rated-movies-89807) |  
| Movie Plot Dataset (100K) | [Kaggle](https://www.kaggle.com/datasets/sidhantyadav/movie-plot-dataset-with-100k-movies-plots) |  
| Wikipedia Movie Plots | [Kaggle](https://www.kaggle.com/datasets/jrobischon/wikipedia-movie-plots) |  
| CMU Movie Summary Corpus | [PapersWithCode](https://paperswithcode.com/dataset/cmu-movie-summary-corpus) |  
| Millions of Movies (genre imputation) | [Kaggle](https://www.kaggle.com/datasets/akshaypawar7/millions-of-movies) |  

---

These datasets are also listed in the References section.



## Evaluation & Comparison of Search Methods


This section presents the evaluation of various **semantic search methods**, combining sentence embedding models with vector similarity techniques. We tested methods such as `cosine`, `faiss`, and `annoy` using models like `all-mpnet-base-v2`, `MiniLM`, and `DistilBERT`.  

As a baseline, we included **BM25**, a well-known traditional retrieval algorithm based on exact term matching. BM25 is highly effective for scenarios where users input keywords that closely match the terms found in documents — such as titles, tags, or technical terms. It excels in structured datasets and keyword-centric search engines.  

However, in our case, the task involved **natural language queries** describing movie plots or abstract ideas. These queries often use vocabulary and phrasing different from the exact text in the movie metadata. BM25 lacks semantic understanding, so it cannot capture the **meaning** or **intent** behind the queries. As a result, it failed to retrieve relevant results, leading to near-zero accuracy across all models in our validation set.

.

### 📊 Results Summary

| Method       | Embedding model          | Precision@5 | Recall@5 | NDCG@5 | MAP    | Mean time per query |
|-------------|---------------------------|-------------|----------|--------|--------|--------------|
| bm25        | –                         | 0.00        | 0.000    | 0.000  | 0.000  | 0.715        |
| cosine      | all_mpnet_base_v2         | **0.30**    | **0.096**    | **0.296**  | 0.063  | **0.113**    |
|             | all_MiniLM_L12_v2         | 0.26        | **0.095**    | 0.289  | 0.072  | 0.061        |
|             | multi_qa_distilbert_cos_v1| 0.26        | 0.089    | 0.224  | 0.050  | **0.098**        |
| faiss_flat  | all_mpnet_base_v2         | **0.28**    | 0.090    | **0.298**| 0.064 | 0.101        |
|             | all_MiniLM_L12_v2         | 0.26        | **0.095**    | 0.291  | 0.074  | **0.055**    |
|             | multi_qa_distilbert_cos_v1| 0.24        | 0.083    | 0.213  | 0.046  | 0.087        |
| faiss_hnsw  | all_mpnet_base_v2         | **0.30**    | **0.095**    | 0.268  | 0.053  | 2.003        |
|             | all_MiniLM_L12_v2         | 0.20        | 0.078    | 0.218  | 0.058  | 1.211        |
|             | multi_qa_distilbert_cos_v1| 0.22        | 0.076    | 0.211  | 0.050  | 1.584        |
| annoy       | all_mpnet_base_v2         | 0.26        | 0.089    | 0.280  | 0.060  | 2.013        |
|             | all_MiniLM_L12_v2         | 0.20        | 0.076    | 0.226  | 0.063  | 1.016        |
|             | multi_qa_distilbert_cos_v1| 0.12        | 0.038    | 0.134  | 0.027  | 1.983        |


_*Accuracy measured on a small, manually created validation set (validation_set.json) with 10 queries and their relevant movies._

#### 📌 Best Choice: all_mpnet_base_v2 + cosine similarity

This combination achieved the highest Precision@5 (0.30) among the fastest methods (under 0.2 seconds per query), while also maintaining strong recall and NDCG scores:

    Precision@5: 0.30 — meaning, on average, 3 out of the top 5 results were relevant.

    Recall@5: 0.096 — good considering only 5 results were retrieved.

    NDCG@5: 0.296 — indicating relevance was well-ranked.

    MAP: 0.063 — slightly lower than some others, but still solid.

    Time per query: 0.113 seconds — very fast, enabling real-time search.

#### ❌ Why not others?

    BM25 gave zero accuracy — likely because it relies on exact word matching, which doesn't work well for semantically rich, natural language queries.

    FAISS HNSW and Annoy sometimes matched cosine, but didn't overperform it, yet they were 10–20× slower.

| Model                        | Title (s) | Plot (s) | Genres (s) | Total (s) |
|-----------------------------|-----------|----------|------------|-----------|
| all-MiniLM-L12-v2           | 17.55     | 26.44    | 16.15      | 60.26 |
| all-mpnet-base-v2           | 18.00     | 115.87   | 18.50      | 152.64    |
| multi-qa-distilbert-cos-v1  | 12.35 | 55.44    | 12.14  | 80.21     |

### 🧾 Conclusion:

Although _all-mpnet-base-v2_ is the slowest model—mainly due to the high time cost of encoding plots—it consistently delivers the best performance in terms of retrieval quality (see previous ranking results).

This superior quality far outweighs the initial embedding time, especially considering that:

- The dataset embeddings are precomputed and stored, so encoding is done once.

- During actual use (processing a single query), latency becomes negligible.

> ✅ Conclusion: _all-mpnet-base-v2_ is the best choice when quality matters most, which is critical for generating accurate and relevant movie recommendations.

## Application Interface

<table>
  <tr>
    <td><img src="https://downloader.disk.yandex.ru/preview/8348c4065aab33b12913a4f2cde20473ae52d6a0ab4373b70b4cb8e63d7d9423/686556b8/RFPbOvvxRZ2SAF5wZzYMfY6KwEF0Zw2OEJXxys-9yFLavl4mTflby2cx-ngiO0wWV0laROY-_ATE6BTeE3hBIw%3D%3D?uid=0&filename=%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202025-07-02%20145157.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v3&size=2048x2048" alt="MoviePlot Search" width="400"/></td>
    <td><img src="https://downloader.disk.yandex.ru/preview/53f9b7015b443440f9cb5ad203a2613a216d15630c873d7affc821903274ba71/68655701/DlmInTB54Cf5rFRi1_38kO9nVd56r4UxjxQm_-4qF2Tb7uf2ctIh2XYa9UQezAb0Z6F0JOy096z058lf_dbw3A%3D%3D?uid=0&filename=%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202025-07-02%20145235.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v3&size=2048x2048" alt="Example of Search" width="400"/></td>
  </tr>
</table>

## Installation & Usage
> **Note:**  
> During the presentation, a live demo link will be provided for easy access. Otherwise, to use the application locally, both the backend and frontend need to be run on your computer.


### Frontend Set Up
| Command          | Description                               |     |
| ---------------- | ----------------------------------------- | --- |
| `npm start`      | Launch development server with hot-reload | 🚀  |
| `npm run build`  | Create optimized production build         | 🏗️  |
| `npm test`       | Run test suite in interactive watch mode  | 🧪  |
| `npm run format` | Format code with Prettier (if configured) | 🎨  |

## Limitations and Future Work

Although our system works well for finding movies based on natural language descriptions, there are some limitations to keep in mind:

- **Movie vs. TV Series Confusion:** Our data does not clearly separate movies from TV shows. This sometimes causes mixed results when searching. Adding clearer labels or a way to tell them apart would help.

- **Issues with Indian Movies:** The system has trouble correctly recognizing many Indian movies. This might be due to differences in how their plots are written or metadata problems. We need to look into this more and possibly add better data for these movies.

- **Lack of a Large Query-Answer Dataset:** We do not have a big set of real user queries with correct movie answers for evaluation. Right now, we mainly check if the right movies appear in the top 5 results. Creating such a dataset would let us evaluate the system better.

- **Need for Ranking-Based Metrics:** We only check if relevant movies are found, but not how well they are ranked within the results. Using ranking metrics like nDCG or MRR on a good validation set would give us more insight into how well the search results are ordered.

Working on these points will make the search engine more accurate and reliable for users.


## References

### Datasets

- [Top Rated Movies](https://www.kaggle.com/datasets/suvroo/top-rated-movies-89807)  
- [Movie Plot Dataset with 100K Movies Plots](https://www.kaggle.com/datasets/sidhantyadav/movie-plot-dataset-with-100k-movies-plots)   
- [Wikipedia Movie Plots](https://www.kaggle.com/datasets/jrobischon/wikipedia-movie-plots)  
- [CMU Movie Summary Corpus](https://paperswithcode.com/dataset/cmu-movie-summary-corpus)
- [Millions of Movies](https://www.kaggle.com/datasets/akshaypawar7/millions-of-movies)  

### Embedding Models

- `all-mpnet-base-v2` — [Sentence Transformers Model](https://huggingface.co/sentence-transformers/all-mpnet-base-v2)  
- `all-MiniLM-L6-v2` — [Sentence Transformers MiniLM Model](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)  
- `multi-qa-distilbert-cos-v1` — [DistilBERT Model](https://huggingface.co/sentence-transformers/multi-qa-distilbert-cos-v1)  

### Retrieval Methods

- **FAISS** (Facebook AI Similarity Search) — Efficient similarity search and clustering library ([GitHub](https://github.com/facebookresearch/faiss))  
- **Annoy** (Approximate Nearest Neighbors Oh Yeah) — Fast approximate nearest neighbor search ([GitHub](https://github.com/spotify/annoy))  
- **BM25** (Best Matching 25) — A classic probabilistic ranking function for keyword-based search ([Original Paper](https://dl.acm.org/doi/10.1145/313240.313272))  


