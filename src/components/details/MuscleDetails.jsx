import React from 'react';

/**
 * MuscleDetails Component
 * Displays detailed information about a muscle
 */
export function MuscleDetails({ muscle }) {
  if (!muscle) {
    return (
      <div className="placeholder">
        <p>Выберите мышцу для просмотра детальной информации</p>
      </div>
    );
  }

  return (
    <div className="details-content">
      <h2>{muscle.name}</h2>
      {muscle.nameEn && (
        <p className="latin-name">{muscle.nameEn}</p>
      )}

      {muscle.function && (
        <div className="info-section">
          <h3>Функция</h3>
          <p>{muscle.function}</p>
        </div>
      )}

      {muscle.origin && (
        <div className="info-section">
          <h3>Начало</h3>
          <p>{muscle.origin}</p>
        </div>
      )}

      {muscle.insertion && (
        <div className="info-section">
          <h3>Прикрепление</h3>
          <p>{muscle.insertion}</p>
        </div>
      )}

      {muscle.description && (
        <div className="info-section">
          <h3>Описание</h3>
          <p>{muscle.description}</p>
        </div>
      )}

      {muscle.group && (
        <div className="info-section">
          <h3>Группа</h3>
          <p className="muscle-group">{muscle.group}</p>
        </div>
      )}
    </div>
  );
}
