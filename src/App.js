import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: {} };
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  getUpdatedWordFrequency = (text) => {
    const stopWords = new Set([
      "the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that", "which",
      "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours", "you", "your",
      "yours", "he", "him", "his", "she", "her", "hers", "was", "were", "is", "am", "are", "be", "been", "being", "have",
      "has", "had", "having", "do", "does", "did", "doing", "a", "each", "how", "what", "i", "me", "my", "myself", "you"
    ]);
    const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");
    const filteredWords = words.filter(word => !stopWords.has(word));

    const newWordFrequency = filteredWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {});

    this.setState({
      wordFrequency: newWordFrequency,
    });
  };

  renderChart() {
    const svg = d3.select(".svg_parent").attr("width", 1000).attr("height", 200);

    const data = Object.entries(this.state.wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const stablePositions = [100, 300, 500, 700, 900];

    const maxFrequency = data[0] ? data[0][1] : 1;
    const fontSizeScale = d3.scaleLinear()
      .domain([1, maxFrequency])
      .range([20, 50]);

    const words = svg.selectAll("text").data(data, d => d[0]);

    words.enter()
      .append("text")
      .attr("x", (d, i) => stablePositions[i])
      .attr("y", 100)
      .attr("fill", "black")
      .style("opacity", 0)
      .style("font-size", "0px")
      .text(d => d[0])
      .transition()
      .duration(4000)
      .style("opacity", 1)
      .style("font-size", d => `${fontSizeScale(d[1])}px`);

    words.transition()
      .duration(4000)
      .attr("x", (d, i) => stablePositions[i])
      .style("font-size", d => `${fontSizeScale(d[1])}px`);

    words.exit().transition().duration(500).style("opacity", 0).remove();
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea id="input_field" style={{ height: 150, width: 1000 }}></textarea>
          <button
            type="submit"
            value="Generate WordCloud"
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={() => {
              const input_data = document.getElementById("input_field").value;
              this.getUpdatedWordFrequency(input_data);
            }}
          >
            Generate WordCloud
          </button>
        </div>
        <div className="child2">
          <svg className="svg_parent"></svg>
        </div>
      </div>
    );
  }
}

export default App;
