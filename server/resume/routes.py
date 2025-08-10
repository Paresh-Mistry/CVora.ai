from flask import request, jsonify
from . import resume_bp
import time

from .utils import (
    generate_resume_insight,
    overview_chain,
    activities_chain,
    job_match_chain,
    learning_advice_chain,
)

@resume_bp.route('/', methods=['GET', 'POST'])
def resume_home():
    if request.method == "POST":
        data = request.get_json()
        print("Received data:", data)

        # Validate required fields
        required_fields = ['name', 'role', 'skill', 'project_title', 'degree']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400

        # Extract values
        name = data['name']
        role = data['role']
        skill = data['skill']
        project_title = data['project_title']
        degree = data['degree']

        try:

            print("Calling generate_resume_insight...")
            insight = generate_resume_insight(name, role, skill, project_title, degree, time.strftime('Y'))
            print("Insight ready")
            print('--- All Analysis Generated ---')
            
            return jsonify({
                "name": name,
                "role": role,
                "insight": insight
            })

        except Exception as e:
            print('Error during resume analysis:', str(e))
            return jsonify({
                "error": "An error occurred while generating analysis.",
                "details": str(e)
            }), 500

    # Optional: handle GET request to test API health
    return jsonify({"message": "Resume analysis endpoint is active."}), 200
