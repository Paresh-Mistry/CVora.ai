from langchain_core.prompts import PromptTemplate
from langchain_community.llms import ollama

llm = ollama.Ollama(model="llama3.2:1b")  # shared LLM instance

def overview_chain(name, role, skill, project_title, degree):
    prompt = PromptTemplate.from_template("""
    Based on the following resume details:
    - Name: {name}
    - Desired Role: {role}
    - Skills: {skill}
    - Project Title: {project_title}
    - Degree: {degree}

    Write a short and crisp overview of the person in 2-3 lines, highlighting their strengths and passion.
    """)
    return llm.invoke(prompt.format(name=name, role=role, skill=skill, project_title=project_title, degree=degree))

def activities_chain(skill, role):
    prompt = PromptTemplate.from_template("""
    Based on the skill set: {skill} and desired role: {role},
    suggest 2-3 co-curricular or extra-curricular activities in short the person should pursue to enhance their resume.
    """)
    return llm.invoke(prompt.format(skill=skill, role=role))

def job_match_chain(skill, role, degree):
    prompt = PromptTemplate.from_template("""
    The person has the following profile:
    - Role: {role}
    - Skills: {skill}
    - Degree: {degree}

    Suggest 3 recent job titles or roles with that align well with their profile and skills. Share some Links of Recent Job Postings.
    """)
    return llm.invoke(prompt.format(skill=skill, role=role, degree=degree))

def learning_advice_chain(skill, role):
    prompt = PromptTemplate.from_template("""
    Based on the role: {role} and current skills: {skill},
    suggest what the person should learn next to stay relevant and grow in their field. Include resources or technologies they should focus on. Give me 3-4 lines maximum
    """)
    return llm.invoke(prompt.format(skill=skill, role=role))

# === Combined Chain Call ===

def generate_resume_insight(name, role, skill, project_title, degree):
    return {
        "overview": overview_chain(name, role, skill, project_title, degree),
        "activities": activities_chain(skill, role),
        "job_matches": job_match_chain(skill, role, degree),
        "learning_advice": learning_advice_chain(skill, role)
    }
