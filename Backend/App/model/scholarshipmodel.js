let mongoose=require('mongoose')

let ScholarshipSchema=mongoose.Schema({
    title: String,
  provider: String,
  amount: String,
  amountValue: Number,
currency: { type: String, default: "INR" },
  eligibility: {
    courses: [String],
    minGPA: Number,
    locations: [String],
    categories: [String]
  },
  deadline: Date,
  description: String,
  url: String,
  source: String,
  tags: [String],
  scrapedAt: { type: Date, default: Date.now }
})
// after schema definition
ScholarshipSchema.index({ title: 'text', provider: 'text', description: 'text', tags: 'text' });

const UserSchema=mongoose.Schema({
    name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  profile: {
    course: String,
    gpa: Number,
    location: String,
    categories: [String]
  },
  savedScholarships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' }]
})

const Scholarship = mongoose.model('Scholarship', ScholarshipSchema);
const User = mongoose.model('User', UserSchema);

module.exports = { Scholarship, User };
