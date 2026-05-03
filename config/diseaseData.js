/**
 * Comprehensive mapping of diseases to medical specialist types, descriptions, and precautions.
 */
const diseaseData = {
    "Fungal infection": {
        specialization: "Dermatologist",
        description: "An inflammatory condition caused by a fungus, often affecting skin or nails.",
        precautions: ['Maintain hygiene', 'Use antifungal cream', 'Keep skin dry']
    },
    "Chicken pox": {
        specialization: "General Physician",
        description: "A highly contagious viral infection that causes an itchy, blister-like rash.",
        precautions: ['Isolation', 'Avoid scratching', 'Cool baths with baking soda']
    },
    "Dengue": {
        specialization: "General Physician",
        description: "A mosquito-borne viral infection causing severe flu-like illness.",
        precautions: ['Hydration', 'Complete bed rest', 'Monitor platelet count']
    },
    "Typhoid": {
        specialization: "General Physician",
        description: "A bacterial infection that can spread throughout the body, affecting many organs.",
        precautions: ['Drink boiled water', 'Thorough hand washing', 'Eat warm food']
    },
    "Malaria": {
        specialization: "General Physician",
        description: "A serious and sometimes fatal disease caused by a parasite that commonly infects a certain type of mosquito.",
        precautions: ['Use mosquito nets', 'Wear long sleeves', 'Eliminate stagnant water']
    },
    "Common Cold": {
        specialization: "General Physician",
        description: "A viral infection of your nose and throat, usually harmless.",
        precautions: ['Rest and hydration', 'Gargle salt water', 'Warm fluids like soup']
    },
    "Pneumonia": {
        specialization: "Pulmonologist",
        description: "An infection that inflames the air sacs in one or both lungs.",
        precautions: ['Stay hydrated', 'Get plenty of rest', 'Avoid smoking']
    },
    "Tuberculosis": {
        specialization: "Pulmonologist",
        description: "A serious infectious disease that mainly affects your lungs.",
        precautions: ['Wear a mask', 'Ventilate your room', 'Avoid close contact']
    },
    "AIDS": {
        specialization: "Infectious Disease Specialist",
        description: "A chronic, potentially life-threatening condition caused by the human immunodeficiency virus (HIV).",
        precautions: ['Antiretroviral therapy', 'Safe practices', 'Regular checkups']
    },
    "Urinary tract infection": {
        specialization: "Urologist",
        description: "An infection in any part of your urinary system — your kidneys, ureters, bladder and urethra.",
        precautions: ['Drink plenty of water', 'Wipe from front to back', 'Urinate after intercourse']
    },
    "Hepatitis A": {
        specialization: "Gastroenterologist",
        description: "A highly contagious liver infection caused by the hepatitis A virus.",
        precautions: ['Vaccination', 'Hand hygiene', 'Avoid raw seafood']
    },
    "Diabetes": {
        specialization: "Diabetologist",
        description: "A chronic condition that affects how your body turns food into energy.",
        precautions: ['Monitor blood sugar', 'Healthy diet', 'Regular physical activity']
    },
    "Hypertension": {
        specialization: "Cardiologist",
        description: "A condition in which the force of the blood against your artery walls is too high.",
        precautions: ['Reduce salt intake', 'Regular exercise', 'Stress management']
    },
    "Heart attack": {
        specialization: "Cardiologist",
        description: "Medical emergency when flow of blood to the heart is blocked.",
        precautions: ['Healthy heart diet', 'Emergency medical help', 'Regular cardiac checkups']
    },
    "Bronchial Asthma": {
        specialization: "Pulmonologist",
        description: "A condition in which your airways narrow and swell and may produce extra mucus.",
        precautions: ['Identify triggers', 'Use inhaler as prescribed', 'Avoid allergens']
    },
    "Migraine": {
        specialization: "Neurologist",
        description: "A headache that can cause severe throbbing pain or a pulsing sensation.",
        precautions: ['Avoid light/sound triggers', 'Keep a headache diary', 'Regular sleep schedule']
    },
    "Arthritis": {
        specialization: "Rheumatologist",
        description: "Inflammation of one or more joints, causing pain and stiffness.",
        precautions: ['Regular low-impact exercise', 'Heat/cold therapy', 'Weight management']
    },
    "Acne": {
        specialization: "Dermatologist",
        description: "Common skin condition that occurs when hair follicles become clogged with oil and dead skin cells.",
        precautions: ['Wash face twice daily', 'Gentle skincare', 'Avoid touching face']
    },
    "Psoriasis": {
        specialization: "Dermatologist",
        description: "A condition in which skin cells build up and form scales and itchy, dry patches.",
        precautions: ['Moisturize frequently', 'Identify triggers', 'Sunlight exposure in moderation']
    },
    "Hypothyroidism": {
        specialization: "Endocrinologist",
        description: "A condition in which the thyroid gland doesn't produce enough thyroid hormone.",
        precautions: ['Monitor fatigue levels', 'Stick to medication', 'Balanced diet']
    },
    "Varicose Veins": {
        specialization: "Vascular Surgeon",
        description: "Gnarled, enlarged veins, most commonly appearing in the legs and feet.",
        precautions: ['Avoid long standing', 'Exercise regularly', 'Compression stockings']
    },
    "Impetigo": {
        specialization: "Dermatologist",
        description: "A highly contagious skin infection that causes red sores on the face.",
        precautions: ['Maintain hygiene', 'Avoid scratching', 'Keep sores covered']
    },
    "Dimorphic Hemorrhoids": {
        specialization: "Gastroenterologist",
        description: "Swollen veins in your lower rectum and anus, similar to varicose veins.",
        precautions: ['High-fiber diet', 'Drink plenty of water', 'Don\'t strain during bowel movements']
    },
    "Cervical spondylosis": {
        specialization: "Orthopedics",
        description: "Age-related wear and tear affecting the spinal disks in your neck.",
        precautions: ['Maintain good posture', 'Neck exercises', 'Use a supportive pillow']
    },
    "Jaundice": {
        specialization: "Gastroenterologist",
        description: "A yellowing of the skin and eyes usually caused by liver issues.",
        precautions: ['Drink plenty of fluids', 'Rest completely', 'Avoid fatty foods']
    },
    "Allergy": {
        specialization: "Allergist",
        description: "A condition in which the immune system reacts abnormally to a foreign substance.",
        precautions: ['Identify and avoid allergens', 'Keep antihistamines handy', 'Maintain clean environment']
    },
    "Gastroesophageal reflux disease": {
        specialization: "Gastroenterologist",
        description: "A digestive disease in which stomach acid or bile irritates the food pipe lining.",
        precautions: ['Avoid late meals', 'Elevate head while sleeping', 'Avoid spicy foods']
    },
    "Drug Reaction": {
        specialization: "Dermatologist",
        description: "An adverse or allergic reaction to a medication.",
        precautions: ['Stop suspected medication', 'Seek medical help', 'Keep a list of allergies']
    },
    "Peptic ulcer disease": {
        specialization: "Gastroenterologist",
        description: "A sore that develops on the lining of the esophagus, stomach, or small intestine.",
        precautions: ['Avoid spicy foods', 'Limit alcohol and smoking', 'Manage stress']
    },
    "Default": {
        specialization: "General Physician",
        description: "Based on the symptoms provided, we recommend seeing a general physician for a thorough checkup.",
        precautions: ['Rest and hydration', 'Monitor symptoms', 'Consult a doctor']
    }
};

module.exports = diseaseData;
