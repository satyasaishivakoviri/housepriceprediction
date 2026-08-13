from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import random

app = Flask(__name__, static_url_path='', static_folder='.', template_folder='.')
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/listings')
def listings():
    return render_template('listings.html')

@app.route('/map')
def map_page():
    return render_template('map.html')

@app.route('/predict_form')
def predict_form():
    return render_template('predictor.html')

@app.route('/results')
def results():
    return render_template('results.html')

@app.route('/details')
def details():
    return render_template('details.html')

@app.route('/list-property')
def list_property():
    return render_template('list_property.html')

@app.route('/assistant')
def assistant():
    return render_template('assistant.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/analytics')
def analytics():
    return render_template('analytics.html')

@app.route('/pro_report')
def pro_report():
    return render_template('pro_report.html')

@app.route('/legal')
def legal():
    return render_template('legal.html')

@app.route('/neighborhood')
def neighborhood():
    return render_template('neighborhood_guide.html')

@app.route('/map_interactive')
def map_interactive():
    return render_template('map_interactive.html')

@app.route('/user_dashboard')
def user_dashboard():
    return render_template('user_dashboard.html')

@app.route('/affordability')
def affordability():
    return render_template('affordability_planner.html')

@app.route('/new_launches')
def new_launches():
    return render_template('new_launches.html')

@app.route('/xai_breakdown')
def xai_breakdown():
    return render_template('xai_breakdown.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Extract features (adjust these based on your actual model inputs later)
        area = float(data.get('area', 0))
        bedrooms = int(data.get('bedrooms', 0))
        bathrooms = int(data.get('bathrooms', 0))
        location = data.get('location', '')
        
        # MOCK PREDICTION LOGIC
        # Replace this block with your actual model loading and prediction:
        # model = pickle.load(open('model.pkl', 'rb'))
        # prediction = model.predict([[area, bedrooms, bathrooms]])
        
        # Simple dummy formula for demonstration:
        base_price = 50000
        price_per_sqft = 150
        bedroom_cost = 20000
        bathroom_cost = 15000
        
        estimated_price = base_price + (area * price_per_sqft) + (bedrooms * bedroom_cost) + (bathrooms * bathroom_cost)
        
        # Add some randomness to make it feel "calculated"
        estimated_price *= random.uniform(0.9, 1.1)
        
        return jsonify({
            'success': True,
            'prediction': round(estimated_price, 2)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
