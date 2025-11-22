import PropTypes from 'prop-types';

const KanbanCard = ({ title, subtitle, date, status, onClick, badge }) => {
  return (
    <div
      className="kanban-card card mb-2 shadow-sm"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="mb-0 fw-bold text-primary">{title}</h6>
          {badge && (
            <span className={`badge ${badge.className}`}>
              {badge.text}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-muted small mb-2">
            <i className="bi bi-person-circle me-1"></i>
            {subtitle}
          </p>
        )}
        {date && (
          <p className="text-muted small mb-0">
            <i className="bi bi-calendar-event me-1"></i>
            {new Date(date).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

KanbanCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
  onClick: PropTypes.func,
  badge: PropTypes.shape({
    text: PropTypes.string,
    className: PropTypes.string,
  }),
};

export default KanbanCard;
