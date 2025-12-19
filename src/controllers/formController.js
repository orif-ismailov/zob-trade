const { body, validationResult } = require('express-validator');
const { sendToChannel, formatRFQMessage } = require('../config/telegram');

/**
 * Form Controller - handles RFQ form submissions
 */

// Validation rules for RFQ form
exports.rfqValidation = [
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('contactPerson').trim().notEmpty().withMessage('Contact person is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('product').isIn(['diesel-en590', 'gasoline-a92', 'gasoline-a95']).withMessage('Valid product is required'),
  body('volume').trim().notEmpty().withMessage('Volume is required'),
  body('destination').trim().notEmpty().withMessage('Destination is required'),
  body('incoterms').isIn(['FOB', 'CIF', 'DAP', 'DDP']).withMessage('Valid incoterms is required'),
  body('message').trim().escape()
];

exports.submitRFQ = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      company,
      contactPerson,
      email,
      phone,
      product,
      volume,
      destination,
      incoterms,
      message
    } = req.body;

    // Product display names
    const productNames = {
      'diesel-en590': 'Diesel EN 590',
      'gasoline-a92': 'Gasoline A-92',
      'gasoline-a95': 'Gasoline A-95'
    };

    // Format and send to Telegram
    const telegramMessage = formatRFQMessage({
      company,
      contactPerson,
      email,
      phone,
      product: productNames[product] || product,
      volume,
      destination,
      incoterms,
      message
    });

    const sent = await sendToChannel(telegramMessage);

    if (!sent) {
      console.error('Failed to send RFQ to Telegram');
      // Still return success to user - we don't want to expose internal errors
      // Log it for admin to investigate
    }

    res.json({
      success: true,
      message: 'Your request has been submitted. We will contact you within 24 hours.'
    });
  } catch (error) {
    console.error('RFQ submission error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again or contact us directly.'
    });
  }
};
