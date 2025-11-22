import PropTypes from 'prop-types';

const KanbanColumn = ({ title, count, children, color = 'primary' }) => {
  return (
    <div className="kanban-column">
      <div className={`kanban-header bg-${color} bg-opacity-10 p-3 rounded-top`}>
        <h6 className="mb-0 fw-bold">
          {title}
          {count !== undefined && (
            <span className={`badge bg-${color} ms-2`}>{count}</span>
          )}
        </h6>
      </div>
      <div className="kanban-body p-2" style={{ minHeight: '400px', maxHeight: '70vh', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

KanbanColumn.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  children: PropTypes.node,
  color: PropTypes.string,
};

export default KanbanColumn;
