import "./StatsCard.css";

function StatsCard({ title, value, icon: Icon, color, description }) {
  return (
    <div className="stats-card">
      <div className="stats-card-top">
        <span>{title}</span>

        <div className={`stats-icon ${color}`}>
          <Icon size={21} />
        </div>
      </div>

      <h2>{value}</h2>

      <p>{description}</p>
    </div>
  );
}

export default StatsCard;