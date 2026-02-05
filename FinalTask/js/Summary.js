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

        if (selectedData.length === 0) {
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
            <h3>Top Popular Songs in Selection</h3>
            <ul style="list-style: none; margin-top:0.5rem;">
        `;

        topPopularSongs.forEach(s => {
            html += `<li style="margin-bottom:0.5rem; font-size:0.85rem;">
                <span class="stat-value">${s.name}</span><br>
                <span style="color:var(--text-secondary)">${s.artists.replace(/[\[\]"]/g, '')} (Pop: ${s.popularity})</span>
            </li>`;
        });

        html += '</ul>';

        d3.select(vis.config.parentElement).html(html);
    }
}
