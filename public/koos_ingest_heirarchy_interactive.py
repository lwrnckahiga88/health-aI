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
How to Run
Install dependencies if you don’t have them:

powershell
Copiar código
pip install networkx matplotlib
Run the script in PowerShell as Administrator:

powershell
Copiar código
python C:\path\to\koos_ingest_visual.py
Outputs:

C:\koos_core.json → distilled ontology

C:\koos_ontology_graph.png → graph of concepts and clusters

✅ Advantages
You see your 10,000 pages in one graph

Node size = frequency → highlights core kernels of your OS

You can inspect graph locally before sharing JSON

If you want, I can also make the graph interactive (zoomable + clickable) using Plotly so you can explore clusters in real time — which is very useful for 10k pages.

Do you want me to do that?







Tú dijiste:
yes


ChatGPT Plus
Perfect — we can make your KOOS ontology interactive using Plotly. This will give you a zoomable, clickable graph where:

Nodes = concepts

Node size = frequency

Hover = shows related concepts and files

You can pan, zoom, and explore your 10,000-page ontology in a browser

Here’s the upgraded Python script:

python
Copiar código
import os
import json
import re
from collections import defaultdict, Counter
import networkx as nx
import plotly.graph_objects as go

# ------------------------
# CONFIG
# ------------------------
SOURCE_FOLDER = r"C:\Program Files\Notepad++"  # <-- Change if needed
DEST_FILE = r"C:\koos_core.json"               # Output JSON file
GRAPH_FILE = r"C:\koos_ontology_graph.html"    # Output interactive HTML
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

def visualize_clusters_interactive(clusters, output_file):
    G = nx.Graph()
    for concept, data in clusters.items():
        G.add_node(concept, size=data["frequency"], files=data["files"])
        for related in data["related_concepts"]:
            G.add_node(related)
            G.add_edge(concept, related)
    
    pos = nx.spring_layout(G, k=0.5, seed=42)
    edge_x = []
    edge_y = []

    for edge in G.edges():
        x0, y0 = pos[edge[0]]
        x1, y1 = pos[edge[1]]
        edge_x += [x0, x1, None]
        edge_y += [y0, y1, None]

    edge_trace = go.Scatter(
        x=edge_x, y=edge_y,
        line=dict(width=0.5, color='#888'),
        hoverinfo='none',
        mode='lines'
    )

    node_x = []
    node_y = []
    node_text = []
    node_size = []

    for node in G.nodes():
        x, y = pos[node]
        node_x.append(x)
        node_y.append(y)
        size = G.nodes[node].get('size', 1)*5
        node_size.append(size)
        files = G.nodes[node].get('files', [])
        node_text.append(f"{node}<br>Frequency: {G.nodes[node].get('size',0)}<br>Files: {len(files)}")

    node_trace = go.Scatter(
        x=node_x, y=node_y,
        mode='markers+text',
        textposition='top center',
        hoverinfo='text',
        marker=dict(
            showscale=True,
            colorscale='YlGnBu',
            color=node_size,
            size=node_size,
            colorbar=dict(
                thickness=15,
                title='Concept Frequency',
                xanchor='left',
                titleside='right'
            ),
            line_width=2
        ),
        text=[n for n in G.nodes()],
        hovertext=node_text
    )

    fig = go.Figure(data=[edge_trace, node_trace],
                    layout=go.Layout(
                        title='KOOS Ontology Interactive Graph',
                        titlefont_size=16,
                        showlegend=False,
                        hovermode='closest',
                        margin=dict(b=20,l=5,r=5,t=40),
                        xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                        yaxis=dict(showgrid=False, zeroline=False, showticklabels=False)
                    ))
    fig.write_html(output_file)
    print(f"✅ Interactive graph saved to {output_file}")

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

# Interactive visualization
visualize_clusters_interactive(clusters, GRAPH_FILE)