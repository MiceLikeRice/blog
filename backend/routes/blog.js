const express = require("express");
const router = express.Router();
const mysql = require("../config/db.js");

// 获取博客列表（带分页功能）
// 获取博客列表（带分页和查询功能）
// 获取博客列表（带分页、查询和分类功能）
router.get("/blogcount", async (req, res) => {
    let query="select count(*) as total from blog WHERE deleted = 0";
    const [results] = await mysql.query(query);
    res.send(results[0])
})

router.get("/allblog", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const perPage = 10; // 每页显示的博客数量
        const offset = (page - 1) * perPage;
        let query = "SELECT blog_id, title, view_count, outline,upload_date,author, content_type, cover_image FROM blog";
        // 检查是否有查询参数
        if (req.query.search) {
            const search = req.query.search;
            query += ` WHERE title LIKE '%${search}%' `;
        }
        // 检查是否有类型参数
        if (req.query.type) {
            const type = req.query.type;
            if (query.includes("WHERE")) {
                query += ` AND content_type = '${type}'`;
            } else {
                query += ` WHERE content_type = '${type}' `;
            }
        }
        if (query.includes("WHERE")) {
            query += `AND deleted = 0`;
        } else {
            query += ` WHERE deleted = 0`;
        }
        query += ` LIMIT ${offset}, ${perPage}`;
        const [results] = await mysql.query(query);
        res.send(results);
    } catch (error) {
        console.error("Error in /allblog:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 获取单篇博客
router.get("/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const query = "SELECT * FROM blog WHERE blog_id = ?";
        const [result] = await mysql.query(query, [blogId]);
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.status(404).send("Blog not found");
        }
    } catch (error) {
        console.error("Error in /blog/:id:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 创建新博客
router.post("/create", async (req, res) => {
    try {
        // 从请求体中获取博客信息
        const { title, outline, body, author, content_type,cover_image } = req.body;
        const query = "INSERT INTO blog (title, outline, body, author, content_type,cover_image,deleted,upload_date) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
        const result = await mysql.query(query, [title, outline, body, author, content_type,cover_image,0]);
        res.send({ message: "Blog created", blogId: result.insertId });
    } catch (error) {
        console.error("Error in /create:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 更新博客
router.put("/update/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const { title, outline, body, author, content_type,cover_image } = req.body;
        const query = "UPDATE blog SET title = ?, outline = ?, body = ?, author = ?, content_type = ?,cover_image= ?,update_date=NOW() WHERE blog_id = ?";
        const result = await mysql.query(query, [title, outline, body, author, content_type,  cover_image ,blogId]);
        res.send("success");
    } catch (error) {
        console.error("Error in /update/:id:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 删除博客
router.put("/delete/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const query = "UPDATE blog SET deleted = 1 WHERE blog_id = ?";
        const result = await mysql.query(query, [blogId]);
        res.send("Blog deleted");
    } catch (error) {
        console.error("Error in /delete/:id:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 阅读博客
router.put("/read/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const query = "UPDATE blog SET view_count= view_count + 1  WHERE blog_id = ?";
        const result = await mysql.query(query, [blogId]);
        res.send("Blog readed");
    } catch (error) {
        console.error("Error in /read/:id:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
