import React from 'react';

/**
 * AboutView Component
 * About page with project info and disclaimer
 */
export function AboutView() {
  return (
    <div className="page about-view">
      <div className="about-container">
        <header className="about-header">
          <h1>ℹ️ О проекте</h1>
          <p className="about-subtitle">
            Muscles React — образовательный сервис по анатомии и фитнесу
          </p>
        </header>

        <div className="about-content">
          {/* Project Info Section */}
          <section className="about-section">
            <h2>🎯 Цель проекта</h2>
            <p>
              Muscles React создан для того, чтобы помочь людям лучше понимать анатомию человеческого тела,
              работу мышц и правильную технику выполнения упражнений.
            </p>
            <p>
              Наша миссия — сделать знания о фитнесе и анатомии доступными и понятными для каждого.
            </p>
          </section>

          {/* Features Section */}
          <section className="about-section">
            <h2>✨ Возможности</h2>
            <ul className="features-list">
              <li>🏋️ Интерактивная визуализация мышц</li>
              <li>📊 Граф связей между мышцами, упражнениями и целями</li>
              <li>💪 База упражнений с описаниями</li>
              <li>🎯 Персонализированные рекомендации</li>
              <li>🌓 Тёмная и светлая темы</li>
              <li>📱 Адаптивный дизайн для всех устройств</li>
            </ul>
          </section>

          {/* Disclaimer Section */}
          <section className="about-section disclaimer-section">
            <h2>⚠️ Важная информация</h2>
            <div className="disclaimer-box">
              <p className="disclaimer-text">
                Этот сервис предназначен <strong>исключительно для образовательных целей</strong>.
              </p>
              <ul className="disclaimer-list">
                <li>• Не является медицинской консультацией</li>
                <li>• Не заменяет профессиональную помощь</li>
                <li>• Перед началом тренировок проконсультируйтесь с врачом</li>
                <li>• При болях или дискомфорте обратитесь к специалисту</li>
                <li>• Автор не несёт ответственности за последствия использования информации</li>
              </ul>
              <p className="disclaimer-footer">
                Используя этот сервис, вы принимаете данные условия и понимаете его образовательный характер.
              </p>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section className="about-section">
            <h2>🛠️ Технологии</h2>
            <div className="tech-stack">
              <span className="tech-badge">React 19</span>
              <span className="tech-badge">Vite</span>
              <span className="tech-badge">D3.js</span>
              <span className="tech-badge">React Router</span>
            </div>
          </section>

          {/* Contact Section */}
          <section className="about-section">
            <h2>📧 Контакты</h2>
            <p>
              Если у вас есть вопросы, предложения или вы нашли ошибку, пожалуйста, свяжитесь с нами.
            </p>
            <p className="contact-info">
              GitHub: <a href="https://github.com/yourusername/muscles-react" target="_blank" rel="noopener noreferrer">
                muscles-react
              </a>
            </p>
          </section>

          {/* Version Info */}
          <footer className="about-footer">
            <p>Версия: 0.1.0 (MVP)</p>
            <p>© 2026 Muscles React. Образовательный проект.</p>
          </footer>
        </div>
      </div>

      <style>{`
        .about-view {
          padding: 2rem;
          min-height: 100vh;
        }

        .about-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .about-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .about-header h1 {
          font-size: 2.5rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .about-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
        }

        .about-content {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .about-section {
          background: var(--bg-secondary);
          padding: 2rem;
          border-radius: 12px;
          border: 2px solid var(--border-color);
        }

        .about-section h2 {
          color: var(--text-primary);
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .about-section p {
          color: var(--text-primary);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .about-section p:last-child {
          margin-bottom: 0;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .features-list li {
          padding: 0.75rem 0;
          color: var(--text-primary);
          font-size: 1.05rem;
        }

        /* Disclaimer Section */
        .disclaimer-section {
          background: var(--bg-tertiary);
          border-color: var(--accent-primary);
        }

        .disclaimer-box {
          background: var(--bg-secondary);
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid var(--accent-primary);
        }

        .disclaimer-text {
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .disclaimer-list {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0;
        }

        .disclaimer-list li {
          padding: 0.5rem 0;
          color: var(--text-primary);
          line-height: 1.5;
        }

        .disclaimer-footer {
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-style: italic;
          margin-top: 1rem;
        }

        /* Tech Stack */
        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .tech-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: var(--accent-primary);
          color: white;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Contact */
        .contact-info {
          font-size: 1.05rem;
        }

        .contact-info a {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 500;
        }

        .contact-info a:hover {
          text-decoration: underline;
        }

        /* Footer */
        .about-footer {
          text-align: center;
          padding: 2rem 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .about-footer p {
          margin: 0.5rem 0;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .about-view {
            padding: 1rem;
          }

          .about-header h1 {
            font-size: 2rem;
          }

          .about-subtitle {
            font-size: 1rem;
          }

          .about-section {
            padding: 1.5rem;
          }

          .about-section h2 {
            font-size: 1.3rem;
          }

          .disclaimer-box {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
