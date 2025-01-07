import React, { useEffect, useState } from "react";
import ChatRoomsAPI from "../API/ChatRoomsAPI";

import "./Chat.css";

const io = require("socket.io-client");
const socket = io("http://localhost:5000");

function Chat(props) {
  const [allRoom, setAllRoom] = useState([]);
  const [roomId, setRoomId] = useState(
    localStorage.getItem("current-room") || ""
  );
  const [message, setMessage] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [newMessage, setNewMessage] = useState(false); // thiết lập nhận thông báo mới
  const [roomHasNewMessage, setRoomHasNewMessage] = useState(); // thiết lập phòng có tin nhắn mới

  const onChangeText = (e) => {
    setTextMessage(e.target.value);
  };
  //hàm biến mất thông báo tin nhắn mới khi admin click vào input
  const removeNewMessage = () => {
    setNewMessage(false);
  };
  // Hàm này dùng để tải danh sách phòng chat hiện có
  const fetchRooms = async () => {
    const result = await ChatRoomsAPI.getAllRoom();
    setAllRoom(result.rooms); // Update allRoom state with fetched rooms
    return result.rooms;
  };
  useEffect(() => {
    fetchRooms();
  }, []);

  // Hàm này dùng để load dữ liệu message và nó sẽ chạy lại khi state id_user2 thay đổi
  // Tức là khi admin chọn người dùng mà admin muốn chat thì state id_user2 sẽ thay đổi
  // để gọi lại hàm này
  const fetchData = async (roomId) => {
    const result = await ChatRoomsAPI.getMessageByRoomId(roomId);
    console.log("cotent", result.content);
    setMessage(result.content || []);
  };
  useEffect(() => {
    if (roomId) {
      fetchData(roomId);
    }
  }, [roomId]);
  // Hàm này dùng để gửi tin nhắn cho khách hàng
  const handlerSend = async () => {
    if (!roomId || textMessage.trim() === "") {
      return;
    }

    const data = {
      message: textMessage,
      roomId: roomId,
      is_admin: true,
    };

    try {
      await ChatRoomsAPI.addMessage(data); // Save message to database

      socket.emit("send_message", data); // Emit message to server

      setTextMessage(""); // Clear input field
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  const handleRoomChange = (roomId) => {
    localStorage.setItem("current-room", roomId);
    setRoomId(roomId);
  };
  //Nhận dữ liệu từ server gửi lên thông qua socket với key receive_message

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Received message:", data);
      fetchData(data.roomId);
    });
  }, []);

  useEffect(() => {
    socket.on("delete-room", async (data) => {
      console.log("delete-room", data);
      localStorage.removeItem("current-room");
      const newRooms = await fetchRooms();
      console.log(newRooms);
      if (newRooms.length > 0) {
        const roomId = newRooms[0]._id;
        console.log(roomId);
        localStorage.setItem("current-room", roomId);
        setRoomId(roomId);
      }
    });
  }, []);

  useEffect(() => {
    // Listen for new rooms created
    socket.on("new_room_created", (data) => {
      console.log("New room created:", data);
      fetchRooms();
    });
  }, [socket]);
  useEffect(() => {
    // Listen for new message created
    socket.on("new-message", (data) => {
      setNewMessage(true);
      setRoomHasNewMessage(data.roomId);
    });
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
              Chat
            </h4>
            <div className="d-flex align-items-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 p-0">
                  <li
                    className="breadcrumb-item text-muted active"
                    aria-current="page"
                  >
                    Apps
                  </li>
                  <li
                    className="breadcrumb-item text-muted"
                    aria-current="page"
                  >
                    Chat
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="row no-gutters">
                <div className="col-lg-3 col-xl-2 border-right">
                  <div className="card-body border-bottom">
                    <form>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Search Contact"
                      />
                    </form>
                  </div>
                  <div
                    className="scrollable position-relative"
                    style={{ height: "calc(80vh - 111px)" }}
                  >
                    <ul className="mailbox list-style-none">
                      <li>
                        <div className="message-center">
                          {allRoom &&
                            allRoom.map((value) => (
                              <a
                                key={value._id}
                                onClick={() => handleRoomChange(value._id)}
                                style={{
                                  background: `${
                                    roomId === value._id
                                      ? "rgb(186, 186, 238)"
                                      : "transparent"
                                  }`,
                                }}
                                className="message-item d-flex align-items-center border-bottom px-3 py-2 active_user"
                              >
                                <div className="user-img">
                                  {" "}
                                  <img
                                    src="https://img.icons8.com/color/36/000000/administrator-male.png"
                                    alt="user"
                                    className="img-fluid rounded-circle"
                                    width="40px"
                                  />{" "}
                                  <span className="profile-status away float-right"></span>
                                </div>
                                <div className="w-75 d-inline-block v-middle pl-2">
                                  <h6 className="message-title mb-0 mt-1">
                                    {value._id}
                                  </h6>
                                  {newMessage &&
                                    roomHasNewMessage === value._id && (
                                      <p
                                        style={{
                                          fontSize: "7px",
                                          color: "gray",
                                        }}
                                      >
                                        New Message
                                      </p>
                                    )}
                                </div>
                              </a>
                            ))}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-9  col-xl-10">
                  <div
                    className="chat-box scrollable position-relative"
                    style={{ height: "calc(80vh - 111px)" }}
                  >
                    <ul className="chat-list list-style-none px-3 pt-3">
                      {message &&
                        message.map((value, index) =>
                          value.is_admin ? (
                            <li
                              className="chat-item odd list-style-none mt-3"
                              key={index}
                            >
                              <div className="chat-content text-right d-inline-block pl-3">
                                <div className="box msg p-2 d-inline-block mb-1">
                                  You: {value.message}
                                </div>
                                <br />
                              </div>
                            </li>
                          ) : (
                            <li
                              className="chat-item list-style-none mt-3"
                              key={index}
                            >
                              <div className="chat-img d-inline-block">
                                <img
                                  src="https://img.icons8.com/color/36/000000/administrator-male.png"
                                  alt="user"
                                  className="rounded-circle"
                                  width="45"
                                />
                              </div>
                              <div className="chat-content d-inline-block pl-3">
                                <h6 className="font-weight-medium">
                                  {value.name}
                                </h6>
                                <div className="msg p-2 d-inline-block mb-1">
                                  Client: {value.message}
                                </div>
                              </div>
                              <div className="chat-time d-block font-10 mt-1 mr-0 mb-3"></div>
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                  <div className="card-body border-top">
                    <div className="row">
                      <div className="col-9">
                        <div className="input-field mt-0 mb-0">
                          <input
                            id="textarea1"
                            placeholder="Type and enter"
                            className="form-control border-0"
                            type="text"
                            onClick={removeNewMessage}
                            onChange={onChangeText}
                            value={textMessage}
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <a
                          className="btn-circle btn-lg btn-cyan float-right text-white"
                          onClick={handlerSend}
                        >
                          <i className="fas fa-paper-plane"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer text-center"></footer>
    </div>
  );
}

export default Chat;
