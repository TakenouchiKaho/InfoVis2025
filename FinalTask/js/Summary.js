class SummaryView {
    constructor(config, data) {
        this.config = {
            parentElement: config.parentElement
        };
        this.data = data;
        this.updateVis(data);
    }

    updateVis(selectedData) {
        let vis = this;
        vis.lastSelection = selectedData; // Save to return from track view

        if (!selectedData || selectedData.length === 0) {
            d3.select(vis.config.parentElement).html('<p>No songs selected.</p>');
            return;
        }

        const avgEnergy = d3.mean(selectedData, d => d.energy);
        const avgValence = d3.mean(selectedData, d => d.valence);
        const avgPop = d3.mean(selectedData, d => d.popularity);

        const topPopularSongs = [...selectedData]
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 5);

        let html = `
            <div class="stat-item">Selected Songs: <span class="stat-value">${selectedData.length}</span></div>
            <div class="stat-item">Average Popularity: <span class="stat-value">${avgPop.toFixed(1)}</span></div>
            <div class="stat-item">Average Energy: <span class="stat-value">${avgEnergy.toFixed(2)}</span></div>
            <div class="stat-item">Average Valence: <span class="stat-value">${avgValence.toFixed(2)}</span></div>
            <hr style="margin: 1rem 0; border: 0; border-top: 1px solid var(--glass-border);">
            <h3>Top Popular Songs</h3>
            <ul style="list-style: none; margin-top:0.5rem; max-height: 200px; overflow-y: auto;">
        `;

        topPopularSongs.forEach(s => {
            html += `<li style="margin-bottom:0.5rem; font-size:0.85rem; cursor:pointer;" onclick="triggerSingleSelect('${s.id}')">
                <span class="stat-value" style="color:var(--accent-color)">${s.name}</span><br>
                <span style="color:var(--text-secondary)">${s.artists.replace(/[\[\]"]/g, '')} (Pop: ${s.popularity})</span>
            </li>`;
        });

        html += '</ul><p style="font-size:0.7rem; color:var(--text-secondary); margin-top:1rem;">Tip: Click a dot or a name to see live details.</p>';

        d3.select(vis.config.parentElement).html(html);
    }

    async showTrackDetails(d) {
        let vis = this;
        const container = d3.select(vis.config.parentElement);

        // Show loading
        container.html('<p>Fetching live data...</p>');

        // Fetch from iTunes API (Live Data Requirement)
        let imageUrl = 'https://via.placeholder.com/150?text=No+Image';
        try {
            const query = encodeURIComponent(`${d.name} ${d.artists.replace(/[\[\]"]/g, '').split(',')[0]}`);
            const response = await fetch(`https://itunes.apple.com/search?term=${query}&limit=1&entity=song`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                imageUrl = data.results[0].artworkUrl100.replace('100x100', '300x300');
            }
        } catch (e) {
            console.error("iTunes fetch failed", e);
        }

        let html = `
            <button onclick="summaryView.updateVis(summaryView.lastSelection)" style="background:none; border:1px solid var(--glass-border); color:var(--text-primary); padding:4px 8px; border-radius:4px; cursor:pointer; margin-bottom:1rem;">← Back to Stats</button>
            <div style="text-align:center;">
                <img src="${imageUrl}" style="width:100%; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.3); margin-bottom:1rem;">
                <h3 style="color:var(--accent-color);">${d.name}</h3>
                <p style="font-size:0.9rem; margin-bottom:1rem;">${d.artists.replace(/[\[\]"]/g, '')}</p>
                <div style="text-align:left; font-size:0.85rem; background:rgba(0,0,0,0.2); padding:10px; border-radius:6px;">
                    <div>Popularity: <span class="stat-value">${d.popularity}</span></div>
                    <div>Energy: <span class="stat-value">${d.energy}</span></div>
                    <div>Valence: <span class="stat-value">${d.valence}</span></div>
                    <div>Year: <span class="stat-value">${d.year}</span></div>
                </div>
                <div style="margin-top:1.5rem;">
                    <a href="https://open.spotify.com/track/${d.id}" target="_blank" class="btn-spotify" style="display:inline-block; background:#1DB954; color:white; text-decoration:none; padding:8px 16px; border-radius:20px; font-weight:bold; font-size:0.8rem;">Play on Spotify</a>
                </div>
            </div>
        `;
        container.html(html);
    }
}
