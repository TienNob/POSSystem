import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Paper,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import SendIcon from "@mui/icons-material/Send";
import { db, auth } from "./FirebaseConfig"; // Adjust the import based on your file structure
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "./chatBox.css";

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  return color;
};

const stringAvatar = (name) => {
  if (!name || typeof name !== "string") {
    return {
      sx: {
        bgcolor: "#ccc",
      },
      children: "??",
    };
  }

  const nameParts = name.split(" ");
  if (nameParts.length < 2) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: name[0].toUpperCase(),
    };
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${nameParts[0][0].toUpperCase()}${nameParts[1][0].toUpperCase()}`,
  };
};

const ChatBoxModal = ({ open, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatListRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ ...doc.data(), id: doc.id });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      await addDoc(collection(db, "messages"), {
        text: message,
        timestamp: new Date(),
        user: auth.currentUser ? auth.currentUser.email : "Anonymous",
      });
      setMessage("");
    }
  };

  const getUsername = (email) => {
    return email.split("@")[0];
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <div className="chat-header">
        <DialogTitle className="blackColor">
          <ChatBubbleIcon className="blackColor me-2" fontSize="small" />
          Trò chuyện
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="chat-close-button mb-3"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent className="chat-dialog-content pt-0">
        <Paper elevation={3} className="chat-box" ref={chatListRef}>
          <List className="chat-list">
            {messages.map((msg) => {
              const isCurrentUser =
                auth.currentUser && msg.user === auth.currentUser.email;
              return (
                <ListItem
                  key={msg.id}
                  className={
                    isCurrentUser ? "chat-item-right" : "chat-item-left"
                  }
                >
                  <div
                    className={
                      isCurrentUser
                        ? "message-container-right"
                        : "message-container-left"
                    }
                  >
                    {!isCurrentUser && (
                      <ListItemAvatar>
                        <Avatar
                          {...stringAvatar(
                            getUsername(msg.user || "Anonymous User")
                          )}
                        />
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      className="userName-chat"
                      primary={getUsername(msg.user || "Anonymous")}
                      secondary={msg.text}
                    />
                    {isCurrentUser && (
                      <ListItemAvatar>
                        <Avatar
                          {...stringAvatar(
                            getUsername(msg.user || "Anonymous User")
                          )}
                        />
                      </ListItemAvatar>
                    )}
                  </div>
                </ListItem>
              );
            })}
          </List>
        </Paper>
        <TextField
          fullWidth
          variant="outlined"
          label="Soạn tin"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  className="btn-send"
                  color="primary"
                  onClick={handleSendMessage}
                  edge="end"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          className="chat-input"
        />
      </DialogContent>
    </Dialog>
  );
};

ChatBoxModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatBoxModal;
