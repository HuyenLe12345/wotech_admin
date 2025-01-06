const Confirm = (props) => {
  return (
    <div
      className="confirm"
      style={{
        position: "fixed",
        width: "300px",
        texAlign: "center",
        top: " 40%",
        left: "50%",
        boxShadow: "3px 1px 1px 1px #c9c9c9 ",
        zIndex: "100",
        background: "white",
        border: "1px solid #c9c9c9",
      }}
    >
      <div className="content" style={{ padding: "20px", textAlign: "center" }}>
        <p>Are you sure?</p>
        <button
          className="btn btn-danger"
          onClick={() => props.onConfirm(props.id)}
          // style={{ border: "1px solid black" }}
        >
          Yes
        </button>
        &nbsp;
        <button className="btn btn-success" onClick={props.onCancel}>
          No
        </button>
      </div>
    </div>
  );
};

export default Confirm;
