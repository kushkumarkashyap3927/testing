import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema  = mongoose.Schema( {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
          
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
            lowercase: true,
        
        },
        desc : {
            type: String,
        },
        role : {
            type: String,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        }
    },
    {
        timestamps: true,
    })


userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;