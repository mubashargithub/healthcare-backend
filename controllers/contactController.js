const Admin = require('../models/Admin');

exports.submitContactMessage = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        // Push the new contact message to every admin inside the 'admin' collection
        await Admin.updateMany({}, {
            $push: {
                websiteMessages: {
                    sender: `${name} (${email})`,
                    content: `Subject: ${subject} | ${message}`,
                    date: new Date()
                }
            }
        });

        res.status(200).json({ success: true, message: 'Message successfully archived into Admin collection' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
