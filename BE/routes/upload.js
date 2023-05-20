const router = require('express').Router()
const cloudinary = require('cloudinary').v2
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')

cloudinary.config({
    cloud_name: 'dshuwo0k0',
    api_key: '664464584361741',
    api_secret: 'i0LcUESX266ARbARPCCbxpcNdhI'
})



router.post('/upload', auth, (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ msg: "No files were uploaded." })
        }
        const file = req.files.file;
        if (file.size > 1024 * 1024 * 2) { // 1024*1024 = 1MB
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "Size too large" })
        }
        if (file.mimetype !== "image/jpeg" && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "File format is incorrect." })
        }
        console.log(file);
        cloudinary.uploader.upload(file.tempFilePath, { folder: "dataWeb-thuong-mai" }, async (err, result) => {
            if (err) {
                throw err
            }
            removeTmp(file.tempFilePath)
            res.json({ public_id: result.public_id, url: result.secure_url })
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

router.post('/destroy', auth, authAdmin, (req, res) => {
    const { public_id } = req.body
    try {
        if (!public_id) {
            return res.status(400).json({ msg: "no images is selected" })
        }
        cloudinary.uploader.destroy(public_id, async(err, result)=>{
            if(err) throw err
            
            res.json({msg: "Deleted image"})
        })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
    
})

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}

module.exports = router
