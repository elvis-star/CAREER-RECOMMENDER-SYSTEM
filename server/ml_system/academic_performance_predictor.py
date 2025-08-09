import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AcademicPerformancePredictor:
    def __init__(self, model_path="./models"):
        self.model_path = model_path
        self.models = {}
        self.scalers = {}
        self.label_encoders = {}
        self.is_trained = False
        
        # Setup logging
        self.logger = logging.getLogger('AcademicPredictor')
        
        # Ensure model directory exists
        os.makedirs(model_path, exist_ok=True)
        
        # Grade to points mapping
        self.grade_points = {
            'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8,
            'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
        }
    
    def prepare_data(self, recommendations_data):
        """Prepare training data from recommendations"""
        try:
            self.logger.info("Preparing academic performance data...")
            
            training_records = []
            
            for rec_data in recommendations_data:
                user_id = str(rec_data.get('user', ''))
                kcse_results = rec_data.get('kcseResults', {})
                
                if not kcse_results or 'subjects' not in kcse_results:
                    continue
                
                # Extract academic features
                subjects = kcse_results.get('subjects', [])
                mean_grade = kcse_results.get('meanGrade', 'C')
                mean_points = kcse_results.get('meanPoints', 6.0)
                
                # Calculate subject-specific features
                subject_points = {}
                for subject in subjects:
                    subject_name = subject.get('subject', '')
                    grade = subject.get('grade', 'C')
                    points = self.grade_points.get(grade, 6)
                    subject_points[subject_name.lower()] = points
                
                # Process each career recommendation
                for rec in rec_data.get('recommendations', []):
                    career_id = str(rec.get('career', ''))
                    match_score = rec.get('match', 50)
                    
                    # Create feature vector
                    features = {
                        'user_id': user_id,
                        'career_id': career_id,
                        'mean_points': mean_points,
                        'mathematics': subject_points.get('mathematics', 6),
                        'english': subject_points.get('english', 6),
                        'kiswahili': subject_points.get('kiswahili', 6),
                        'physics': subject_points.get('physics', 6),
                        'chemistry': subject_points.get('chemistry', 6),
                        'biology': subject_points.get('biology', 6),
                        'history': subject_points.get('history & government', 6),
                        'geography': subject_points.get('geography', 6),
                        'business': subject_points.get('business studies', 6),
                        'computer': subject_points.get('computer studies', 6),
                        'match_score': match_score
                    }
                    
                    training_records.append(features)
            
            if not training_records:
                self.logger.warning("No training records found")
                return None
            
            df = pd.DataFrame(training_records)
            self.logger.info(f"Prepared {len(df)} training records")
            return df
            
        except Exception as e:
            self.logger.error(f"Error preparing data: {str(e)}")
            return None
    
    def train_models(self, training_data):
        """Train academic performance prediction models"""
        try:
            self.logger.info("Training academic performance models...")
            
            if training_data is None or training_data.empty:
                self.logger.warning("No training data available")
                return False
            
            # Prepare features and target
            feature_columns = [
                'mean_points', 'mathematics', 'english', 'kiswahili',
                'physics', 'chemistry', 'biology', 'history',
                'geography', 'business', 'computer'
            ]
            
            X = training_data[feature_columns].fillna(6.0)  # Fill missing with average grade
            y = training_data['match_score']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            self.scalers['features'] = StandardScaler()
            X_train_scaled = self.scalers['features'].fit_transform(X_train)
            X_test_scaled = self.scalers['features'].transform(X_test)
            
            # Train multiple models
            models_to_train = {
                'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
                'gradient_boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
                'linear_regression': LinearRegression()
            }
            
            best_model = None
            best_score = -float('inf')
            
            for model_name, model in models_to_train.items():
                # Train model
                model.fit(X_train_scaled, y_train)
                
                # Evaluate
                y_pred = model.predict(X_test_scaled)
                r2 = r2_score(y_test, y_pred)
                
                self.models[model_name] = model
                self.logger.info(f"{model_name} R² score: {r2:.3f}")
                
                if r2 > best_score:
                    best_score = r2
                    best_model = model_name
            
            self.logger.info(f"Best model: {best_model} with R² score: {best_score:.3f}")
            self.is_trained = True
            return True
            
        except Exception as e:
            self.logger.error(f"Error training models: {str(e)}")
            return False
    
    def predict_career_match(self, kcse_results, career_id):
        """Predict career match score based on KCSE results"""
        try:
            if not self.is_trained:
                self.load_models()
            
            if not self.models:
                return None
            
            # Extract features from KCSE results
            subjects = kcse_results.get('subjects', [])
            mean_points = kcse_results.get('meanPoints', 6.0)
            
            subject_points = {}
            for subject in subjects:
                subject_name = subject.get('subject', '').lower()
                grade = subject.get('grade', 'C')
                points = self.grade_points.get(grade, 6)
                subject_points[subject_name] = points
            
            # Create feature vector
            features = np.array([[
                mean_points,
                subject_points.get('mathematics', 6),
                subject_points.get('english', 6),
                subject_points.get('kiswahili', 6),
                subject_points.get('physics', 6),
                subject_points.get('chemistry', 6),
                subject_points.get('biology', 6),
                subject_points.get('history & government', 6),
                subject_points.get('geography', 6),
                subject_points.get('business studies', 6),
                subject_points.get('computer studies', 6)
            ]])
            
            # Scale features
            if 'features' in self.scalers:
                features_scaled = self.scalers['features'].transform(features)
            else:
                features_scaled = features
            
            # Use the best available model
            model_name = 'random_forest' if 'random_forest' in self.models else list(self.models.keys())[0]
            model = self.models[model_name]
            
            prediction = model.predict(features_scaled)[0]
            return max(0, min(100, prediction))  # Clamp between 0 and 100
            
        except Exception as e:
            self.logger.error(f"Error predicting career match: {str(e)}")
            return None
    
    def predict_success_probability(self, user_data, career_data):
        """Predict success probability for a user-career combination"""
        try:
            if 'kcseResults' not in user_data:
                return 0.5  # Default probability
            
            match_score = self.predict_career_match(user_data['kcseResults'], career_data.get('_id', ''))
            
            if match_score is None:
                return 0.5
            
            # Convert match score to probability (0-1)
            return match_score / 100.0
            
        except Exception as e:
            self.logger.error(f"Error predicting success probability: {str(e)}")
            return 0.5
    
    def get_improvement_suggestions(self, user_data, career_data):
        """Get suggestions for improving career match"""
        try:
            suggestions = []
            
            if 'kcseResults' not in user_data:
                return suggestions
            
            kcse_results = user_data['kcseResults']
            subjects = kcse_results.get('subjects', [])
            
            # Analyze subject performance
            subject_scores = {}
            for subject in subjects:
                subject_name = subject.get('subject', '').lower()
                grade = subject.get('grade', 'C')
                points = self.grade_points.get(grade, 6)
                subject_scores[subject_name] = points
            
            # Career-specific suggestions
            career_title = career_data.get('title', 'this career')
            key_subjects = career_data.get('keySubjects', [])
            
            for key_subject in key_subjects:
                subject_lower = key_subject.lower()
                if subject_lower in subject_scores:
                    score = subject_scores[subject_lower]
                    if score < 9:  # Below B grade
                        suggestions.append(
                            f"Consider improving your {key_subject} grade to enhance your suitability for {career_title}"
                        )
            
            # General suggestions
            mean_points = kcse_results.get('meanPoints', 6.0)
            if mean_points < 8:
                suggestions.append("Focus on improving your overall academic performance")
            
            return suggestions[:3]  # Return top 3 suggestions
            
        except Exception as e:
            self.logger.error(f"Error getting improvement suggestions: {str(e)}")
            return []
    
    def save_models(self):
        """Save trained models"""
        try:
            model_data = {
                'models': self.models,
                'scalers': self.scalers,
                'label_encoders': self.label_encoders,
                'is_trained': self.is_trained,
                'grade_points': self.grade_points
            }
            
            model_file = os.path.join(self.model_path, 'academic_performance_models.pkl')
            joblib.dump(model_data, model_file)
            
            self.logger.info(f"Models saved to {model_file}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error saving models: {str(e)}")
            return False
    
    def load_models(self):
        """Load trained models"""
        try:
            model_file = os.path.join(self.model_path, 'academic_performance_models.pkl')
            
            if not os.path.exists(model_file):
                self.logger.warning("Model file not found")
                return False
            
            model_data = joblib.load(model_file)
            
            self.models = model_data.get('models', {})
            self.scalers = model_data.get('scalers', {})
            self.label_encoders = model_data.get('label_encoders', {})
            self.is_trained = model_data.get('is_trained', False)
            self.grade_points = model_data.get('grade_points', self.grade_points)
            
            self.logger.info("Models loaded successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Error loading models: {str(e)}")
            return False

if __name__ == "__main__":
    # Test the model
    predictor = AcademicPerformancePredictor()
    print("Academic Performance Predictor initialized successfully!")
