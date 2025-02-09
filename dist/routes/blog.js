"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Post_1 = __importDefault(require("../models/Post"));
const router = express_1.default.Router();
router.get('/api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find();
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
}));
// Modify the create route to return JSON
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = new Post_1.default(req.body);
    try {
        yield post.save();
        res.status(201).json({ message: 'Post created successfully' });
    }
    catch (err) {
        console.error('Error creating post:', err);
        if (err instanceof Error && err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Post_1.default.findByIdAndDelete(req.params.id);
        res.sendStatus(204); // No content response
    }
    catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).send('Error deleting post');
    }
}));
// List all posts
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find();
        res.render('blog', { posts });
    }
    catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).send('Error fetching posts');
    }
}));
// Fetch a single post by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    }
    catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update a post by ID
router.put('/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post updated successfully', post });
    }
    catch (err) {
        console.error('Error updating post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
