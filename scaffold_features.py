import os

BASE_DIR = "frontend/src/features"

features = {
    "student": {
        "PersonalizedLearningPath": "AI-driven learning path with weekly plans and weak topic tracking.",
        "AITutorMode": "Interactive step-by-step problem solving and adaptive teaching.",
        "SmartAssignmentAssistant": "Plagiarism-safe assignment guidance and hints.",
        "RevisionEngine": "Auto-generated summaries, mind maps, and flashcards.",
        "StudyGroupModerator": "AI-suggested study groups based on skills and pace."
    },
    "faculty": {
        "AIAutoGrader": "Automated grading for MCQs, short answers, and coding tasks.",
        "LessonMaterialGenerator": "Creates PPTs and notes from syllabus.",
        "FacultyDashboard": "Analytics for student performance and engagement.",
        "QuestionBankMaker": "Converts notes into various question formats.",
        "PlagiarismScanner": "AI-based originality checking."
    },
    "verifier": {
        "DeepFakeDetection": "AI analysis for manipulated documents.",
        "CrossDatabaseVerification": "Auto-verification across external databases.",
        "BatchVerification": "Bulk processing of document uploads.",
        "DocumentTimelineHeatmap": "Visual tracking of document history and edits."
    },
    "admin": {
        "WorkflowAutomation": "No-code workflow builder for admin tasks.",
        "InstitutionBrain": "Visual map of institutional data and AI accuracy.",
        "RoleInsights": "Activity tracking for all user roles.",
        "SecurityCompliance": "Advanced security logs and threat detection."
    }
}

def create_component(path, name, description):
    content = f"""import React from 'react';
import {{ Card, CardContent, CardHeader, CardTitle, CardDescription }} from "@/components/ui/card";
import {{ Button }} from "@/components/ui/button";

const {name} = () => {{
  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{{name.replace(/([A-Z])/g, ' $1').trim()}}</h2>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Feature Status</CardTitle>
            <CardDescription>System Readiness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <span className="text-4xl">🚧</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Under Construction</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
                This feature is currently being developed. Check back later for updates.
            </p>
        </div>
      </div>
    </div>
  );
}};

export default {name};
"""
    with open(path, "w") as f:
        f.write(content)

def main():
    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)
        print(f"Created base directory: {BASE_DIR}")

    for role, role_features in features.items():
        role_dir = os.path.join(BASE_DIR, role)
        if not os.path.exists(role_dir):
            os.makedirs(role_dir)
            print(f"Created role directory: {role_dir}")
        
        for feature_name, description in role_features.items():
            feature_dir = os.path.join(role_dir, feature_name)
            if not os.path.exists(feature_dir):
                os.makedirs(feature_dir)
            
            file_path = os.path.join(feature_dir, f"{feature_name}.jsx")
            create_component(file_path, feature_name, description)
            print(f"Generated component: {file_path}")

    # Create an index.js for easier exports
    for role in features.keys():
        index_path = os.path.join(BASE_DIR, role, "index.js")
        with open(index_path, "w") as f:
            for feature in features[role].keys():
                f.write(f"export {{ default as {feature} }} from './{feature}/{feature}';\n")
        print(f"Created index: {index_path}")

if __name__ == "__main__":
    main()
