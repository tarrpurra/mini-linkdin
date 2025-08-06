import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  where,
} from "firebase/firestore";

import { auth, db } from "./DB/connection.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "https://mini-linkdin-three.vercel.app", // or "*", only for testing
  credentials: true,
}));

app.use(express.json());
const PORT = process.env.PORT || 3001;

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Generate JWT
    const token = jwt.sign(
      { uid: user.uid, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ message: "Login successful", token, user: { uid: user.uid } });
  } catch (error) {
    res
      .status(401)
      .json({ error: "Invalid credentials", details: error.message });
  }
});

// Register endpoint
app.post("/api/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Save user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: name || "",
      bio: "", // save name if provided
      createdAt: Date.now(),
    });
    console.log("Incoming body:", req.body);

    const token = jwt.sign(
      { uid: user.uid, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Registration successful",
      user: { uid: user.uid, email: user.email },
      token,
    });
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return res
        .status(400)
        .json({ error: "User already registered with this email." });
    }
    res
      .status(400)
      .json({ error: "Registration failed", details: error.message });
  }
});
// Get user profile by ID
app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  console.log("Fetching user profile for ID:", userId);
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(userSnap.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/users/:id → Update bio
 */
app.put("/api/users/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { bio } = req.body;
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { bio });
    res.json({ message: "Bio updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/posts → Create a post
 */
app.post("/api/posts", authenticateToken, async (req, res) => {
  const { userId, content } = req.body;
  try {
    // Fetch user name
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const name = userSnap.exists() ? userSnap.data().name : "Anonymous";

    const newPost = {
      userId,
      name, // include name in post
      content,
      timestamp: Date.now(),
    };
    const postRef = await addDoc(collection(db, "posts"), newPost);
    res.json({ message: "Post created", id: postRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/posts → List all posts
 */
app.get("/api/posts", async (req, res) => {
  try {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(postsQuery);
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      ...doc.data(),
    }));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/users/:id/posts", async (req, res) => {
  const userId = req.params.id;
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
