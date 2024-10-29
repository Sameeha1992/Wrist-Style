const Category = require("../../models/categorySchema");







const categoryInfo = async(req,res)=>{
    console.log("I am working")

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 4;
        const skip = (page-1)*limit;
        console.log("set aaaiiiiiiiiiii")

        const categoryData = await Category.find({})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);
        console.log("ivdeyum sheriyaiiii")

        const totalCategories = await Category.countDocuments();
        const totalPages = Math.ceil(totalCategories / limit);
        res.render("category",{
            cat:categoryData,
            currentPage:page,
            totalPages:totalPages,
            totalCategories:totalCategories
        })
        console.log(totalPages)
        
    } catch (error) {
        console.error(error);
        res.redirect("/pageerror")
    }

}


const addCategory= async(req,res)=>{
    const {name,description} =req.body;
    try {
        const existingCategory = await Category.findOne({name:name});
        if(existingCategory){
            console.log("category added")
            return res.status(400).json({error:"Category already exists"})
        }
        const newCategory = new Category({
            name,
            description,
        })
        await newCategory.save();
        return res.json({message:"Category added successfully"})
        
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error"})
    }

}




module.exports={
    categoryInfo,
    addCategory
}