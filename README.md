# Movie Plot Similarity: Model Comparison

A benchmark of different embedding approaches to find semantically similar movies based on plot descriptions.

## 📊 Results Summary

| Model/Approach          | Embedding Dim | Accuracy* | Speed (s/1000 texts) | RAM Usage (GB) | Key Pros/Cons               |
|-------------------------|---------------|-----------|----------------------|----------------|-----------------------------|
| `all-MiniLM-L6-v2`   | 384     | -     | - | - |    |
| `all-mpnet-base-v2`     | 768           | -     | -         |-         |  |
| TF-IDF + Cosine         | -             | -     | -     | -|        |
| `paraphrase-multilingual-MiniLM-L12-v2` | 384 | - | - | - |     |
| **Hybrid (MiniLM + TF-IDF)** | 384+ | - | - |-|   |

_*Accuracy measured on ?._

---
