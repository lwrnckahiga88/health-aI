import os
import json
import re
from collections import defaultdict, Counter
import networkx as nx
import matplotlib.pyplot as plt

# ------------------------
# CONFIG
# ------------------------
SOURCE_FOLDER = r"C:\Program Files\Notepad++"  # <-- Change if needed
DEST_FILE = r"C:\koos_core.json"               # Output JSON file
GRAPH_FILE = r"C:\koos_ontology_graph.png"     # Output image
INCLUDE_EXTENSIONS = [
    ".txt", ".md", ".log", ".json", ".yaml", ".yml",
    ".js", ".py", ".ts", ".html", ".css", ".ini", ".cfg"
]
STOPWORDS = set([
    "the","and","for","with","this","that","from","your","have","are",
    "not","you","but","all","any","can","use","useful","will"
])

# ------------------------
# FUNCTIONS
# ------------------------
def extract_concepts(file_content):
    words = re.findall(r'\b\w{4,}\b', file_content.lower())
    return [w for w in words if w not in STOPWORDS]

def merge_clusters(ontology):
    concept_counter = Counter()
    co_occurrence = defaultdict(Counter)
    
    for file_data in ontology.values():
        concepts = file_data["concepts"]
        concept_counter.update(concepts)
        for c1 in concepts:
            for c2 in concepts:
                if c1 != c2:
                    co_occurrence[c1][c2] += 1
    
    top_concepts = [c for c, _ in concept_counter.most_common(50)]
    clusters = {}
    for c in top_concepts:
        related = co_occurrence[c].most_common(10)
        clusters[c] = {
            "related_concepts": [r[0] for r in related],
            "files": [f for f, data in ontology.items() if c in data["concepts"]],
            "frequency": concept_counter[c]
        }
    return clusters

def visualize_clusters(clusters, output_file):
    G = nx.Graph()
    
    # Add nodes and edges
    for concept, data in clusters.items():
        G.add_node(concept, size=data["frequency"])
        for related in data["related_concepts"]:
            G.add_node(related)
            G.add_edge(concept, related)
    
    # Node sizes
    sizes = [G.nodes[n].get("size", 1)*50 for n in G.nodes()]
    
    plt.figure(figsize=(16, 12))
    pos = nx.spring_layout(G, k=0.5, seed=42)
    nx.draw(G, pos, with_labels=True, node_size=sizes, node_color="skyblue", font_size=10, edge_color="gray")
    plt.title("KOOS Ontology Concept Graph", fontsize=16)
    plt.savefig(output_file, dpi=300)
    plt.close()
    print(f"✅ Graph saved to {output_file}")

# ------------------------
# MAIN
# ------------------------
ontology = {}
total_files = 0

for root, dirs, files in os.walk(SOURCE_FOLDER):
    for file in files:
        ext = os.path.splitext(file)[1].lower()
        if ext in INCLUDE_EXTENSIONS:
            total_files += 1
            try:
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                concepts = extract_concepts(content)
                ontology[file] = {
                    "path": filepath,
                    "concepts": list(set(concepts))
                }
            except Exception as e:
                print(f"Skipping {file}: {e}")

clusters = merge_clusters(ontology)

# Save JSON
output = {
    "total_files": total_files,
    "clusters": clusters
}

with open(DEST_FILE, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2)

print(f"✅ KOOS ontology built from {total_files} files.")
print(f"JSON saved to {DEST_FILE}")

# Visualize
visualize_clusters(clusters, GRAPH_FILE)
