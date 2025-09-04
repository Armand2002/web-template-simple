export default function PersonCard({ person, onClick, onEdit, onDelete }) {
  return (
    <article className="person-card">
      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(person.nome + ' ' + (person.cognome || ''))}&background=2f69ff&color=ffffff&rounded=true&size=128`}
        alt={`${person.nome} ${person.cognome}`} 
        className="person-avatar" 
      />

      <div className="person-body">
        <h3 className="person-name">{person.nome} {person.cognome}</h3>
        <div className="person-meta">
          <a href={`mailto:${person.email}`} className="person-email">✉️ {person.email}</a>
          <span className="mx-2">•</span>
          <a href={`tel:${person.telefono || ''}`} className="person-phone">📞 {person.telefono || '—'}</a>
        </div>
      </div>

      <div className="person-actions">
        {onEdit && (
          <button onClick={() => onEdit(person)} className="btn btn-outline" style={{ marginRight: 8 }}>Modifica</button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(person)} className="btn btn-logout">Elimina</button>
        )}
        {!onEdit && !onDelete && onClick && (
          <button onClick={() => onClick(person)} className="btn btn-outline">Apri</button>
        )}
      </div>
    </article>
  )
}
