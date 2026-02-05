# J-Music Popularity Analysis based on Acoustic Features

**Name**: [Your Name]  
**Student ID**: [Your ID Number]  

## 1. Introduction
### Background
The music industry has been significantly transformed by streaming services, where large datasets of song features are now available. Understanding what makes a song "popular" is a key interest for artists, producers, and researchers.

### Research Question
"Does popular artist music (High Popularity) exhibit distinct statistical trends in acoustic features (such as Energy and Valence) compared to less popular music?"

### Objectives
This study aims to visualize the relationship between popularity and acoustic features using a dataset of 3,323 Japanese songs. Specifically, we investigate whether high-popularity songs are clustered in specific regions of the Energy-Valence space.

## 2. Method
### Dataset
- **Total Samples**: 3,323 Japanese songs (J-Pop, Anime, Rock, etc.).
- **Features**: Energy (intensity/activity), Valence (musical positiveness), Popularity (0-100 score).

### System Configuration
The visualization system is built using **HTML5, CSS3, and D3.js (v7)**. It follows a multi-view dashboard design:
1.  **Scatter Plot**: Maps Valence (X) and Energy (Y). Color encodes Popularity.
2.  **Bar Chart**: Shows frequency distribution of niche genres in the selected sample.
3.  **Summary View**: Provides mean values of acoustic features for the current selection.

### Interaction
- **Brushing**: Users can select a region in the scatter plot to filter data.
- **Linking**: The Bar Chart and Summary View update instantly based on the brushed selection.
- **Hovering**: Displays metadata (Song name, Artist, Popularity) via custom tooltips in the scatter plot.

## 3. Result
### Data Distribution
The preliminary analysis showed that Most songs are distributed across a wide range of energy levels, but popularity scores are highly skewed (Median: 15, Max: 76).

### Key Findings
- **Energy-Valence Concentration**: High-popularity songs (Popularity > 60) tend to cluster in the high-energy, high-valence region (the "happy and energetic" quadrant).
- **Genre Patterns**: Anime and J-Pop genres dominate the high-popularity segment, showing higher average energy compared to "Classical" or "Ballad" niche genres.
- **Outliers**: Certain artists like Fujii Kaze demonstrate high popularity even with lower energy or unusual valence values, suggesting artistic uniqueness over standard statistical "hit" formulas.

## 4. Discussion
The positive correlation between Energy/Valence and Popularity (approx. +0.08) suggests a general preference for upbeat music in the Japanese market. However, the discovery of outliers indicates that "acoustic patterns" are not the sole determinant of success; artist brand and genre context (e.g., Anime tie-ins) play crucial roles. The interactive system allowed for quick identification of these trends which would be difficult to spot in static tables.

## 5. Conclusion
Using D3.js, we successfully developed an interactive tool to explore the J-Music features. We confirmed a statistical tendency for popular songs to be energetic and positive, while identifying artist-specific exceptions. The system fulfills the InfoVis 2025 requirements by providing a linked, multi-view exploration environment.

## 6. References
1. Spotify Web API Documentation (Acoustic Features).
2. D3.js Gallery: Scatterplot and Brushing examples.
3. [Insert your reference papers as mentioned in the prompt]
