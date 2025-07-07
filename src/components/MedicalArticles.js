import React, { useState, useEffect } from "react";
import './MedicalArticles.css'; // Import the CSS file for styling

const MedicalArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "87d7d09c0f6e408a9ba6b1730cb8ab51"; // Replace with your NewsAPI key
  const API_URL = `https://newsapi.org/v2/top-headlines?category=health&country=us&apiKey=${API_KEY}`;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.articles) {
          setArticles(data.articles);
        }
      } catch (error) {
        console.error("Error fetching medical articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="medical-articles">
      <h2 className="heading">Latest Medical Articles</h2>
      {loading ? <p className="loading-text">Loading articles...</p> : null}
      <div className="articles-list">
        {articles.map((article, index) => (
          <div key={index} className="article-card">
            <h3 className="article-title">{article.title}</h3>
            <p className="article-description">{article.description}</p>
            <a className="read-more" href={article.url} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalArticles;
