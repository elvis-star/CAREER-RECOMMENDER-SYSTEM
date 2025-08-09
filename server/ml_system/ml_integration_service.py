#!/usr/bin/env python3
import sys
import json
import os
from datetime import datetime
import logging
from pymongo import MongoClient
from dotenv import load_dotenv

# Import our ML models
from collaborative_filtering_model import CollaborativeFilteringModel
from academic_performance_predictor import AcademicPerformancePredictor

# Load environment variables
load_dotenv()

class MLIntegrationService:
    def __init__(self):
        self.setup_logging()
        self.connect_to_database()
        self.cf_model = CollaborativeFilteringModel()
        self.ap_model = AcademicPerformancePredictor()
        
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger('MLIntegrationService')
    
    def connect_to_database(self):
        """Connect to MongoDB database"""
        try:
            mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/career_recommender')
            self.client = MongoClient(mongodb_uri)
            self.db = self.client.get_default_database()
            
            # Test connection
            self.client.admin.command('ping')
            self.logger.info("Connected to MongoDB successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to connect to MongoDB: {str(e)}")
            self.client = None
            self.db = None
    
    def load_data_from_db(self):
        """Load data from MongoDB for training"""
        try:
            # Fix the database check issue
            if self.db is None:
                self.logger.error("No database connection available")
                return None, None
            
            # Load recommendations data
            recommendations_data = list(self.db.recommendations.find())
            self.logger.info(f"Loaded {len(recommendations_data)} recommendation records")
            
            # Load careers data
            careers_data = list(self.db.careers.find())
            self.logger.info(f"Loaded {len(careers_data)} career records")
            
            return recommendations_data, careers_data
            
        except Exception as e:
            self.logger.error(f"Error loading data from database: {str(e)}")
            return None, None
    
    def train_models(self):
        """Train all ML models"""
        try:
            self.logger.info("Starting ML model training...")
            
            # Load data
            recommendations_data, careers_data = self.load_data_from_db()
            
            if not recommendations_data or not careers_data:
                self.logger.warning("Insufficient data for training, creating dummy models")
                return self.create_dummy_models()
            
            # Train collaborative filtering model
            self.logger.info("Training collaborative filtering model...")
            if self.cf_model.prepare_data(recommendations_data, careers_data):
                self.cf_model.train_user_based_cf()
                self.cf_model.train_item_based_cf()
                self.cf_model.train_matrix_factorization()
                self.cf_model.save_model()
                self.logger.info("Collaborative filtering model trained successfully")
            else:
                self.logger.warning("Failed to train collaborative filtering model")
            
            # Train academic performance predictor
            self.logger.info("Training academic performance predictor...")
            training_data = self.ap_model.prepare_data(recommendations_data)
            if training_data is not None and not training_data.empty:
                self.ap_model.train_models(training_data)
                self.ap_model.save_models()
                self.logger.info("Academic performance predictor trained successfully")
            else:
                self.logger.warning("Failed to train academic performance predictor")
            
            return {
                'success': True,
                'message': 'Models trained successfully',
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error training models: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def create_dummy_models(self):
        """Create dummy models when no training data is available"""
        try:
            self.logger.info("Creating dummy models for testing...")
            
            # Create dummy data for collaborative filtering
            dummy_recommendations = [
                {
                    'user': 'user1',
                    'recommendations': [
                        {'career': 'career1', 'match': 85},
                        {'career': 'career2', 'match': 75}
                    ]
                },
                {
                    'user': 'user2',
                    'recommendations': [
                        {'career': 'career1', 'match': 90},
                        {'career': 'career3', 'match': 80}
                    ]
                }
            ]
            
            dummy_careers = [
                {
                    '_id': 'career1',
                    'title': 'Software Engineer',
                    'category': 'Technology',
                    'description': 'Develop software applications',
                    'keySubjects': ['Mathematics', 'Computer Studies']
                },
                {
                    '_id': 'career2',
                    'title': 'Doctor',
                    'category': 'Healthcare',
                    'description': 'Provide medical care',
                    'keySubjects': ['Biology', 'Chemistry', 'Physics']
                },
                {
                    '_id': 'career3',
                    'title': 'Teacher',
                    'category': 'Education',
                    'description': 'Educate students',
                    'keySubjects': ['English', 'Mathematics']
                }
            ]
            
            # Train with dummy data
            if self.cf_model.prepare_data(dummy_recommendations, dummy_careers):
                self.cf_model.train_user_based_cf()
                self.cf_model.save_model()
            
            return {
                'success': True,
                'message': 'Dummy models created for testing',
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error creating dummy models: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def enhance_recommendations(self, user_data, recommendations):
        """Enhance recommendations using ML models"""
        try:
            self.logger.info("Enhancing recommendations with ML...")
            
            # Load models if not already loaded
            self.cf_model.load_model()
            self.ap_model.load_models()
            
            enhanced_recommendations = []
            
            for rec in recommendations:
                enhanced_rec = rec.copy()
                
                # Get ML-enhanced score from collaborative filtering
                user_id = user_data.get('_id', 'unknown')
                cf_recommendations = self.cf_model.get_user_recommendations(str(user_id), 20)
                
                # Find if this career is in CF recommendations
                career_id = str(rec.get('id', ''))
                cf_score = None
                
                for cf_rec in cf_recommendations:
                    if cf_rec['career_id'] == career_id:
                        cf_score = cf_rec['ml_enhanced_score']
                        break
                
                # Get academic performance prediction and improvement suggestions
                ap_score = None
                improvement_suggestions = []

                if 'kcseResults' in user_data:
                    ap_score = self.ap_model.predict_career_match(
                        user_data['kcseResults'], 
                        career_id
                    )
                    
                    # Get improvement suggestions
                    career_data = {
                        '_id': career_id,
                        'title': rec.get('title', 'Unknown Career'),
                        'keySubjects': rec.get('keySubjects', [])
                    }
                    improvement_suggestions = self.ap_model.get_improvement_suggestions(
                        user_data, 
                        career_data
                    )
                else:
                    ap_score = None
                
                # Combine scores
                original_score = rec.get('match', 0)
                final_score = original_score
                
                if cf_score is not None:
                    # Weight: 60% original, 40% collaborative filtering
                    final_score = 0.6 * original_score + 0.4 * (cf_score * 100)
                
                if ap_score is not None:
                    # Further adjust with academic performance prediction
                    final_score = 0.7 * final_score + 0.3 * ap_score
                
                enhanced_rec['ml_enhanced_score'] = min(100, max(0, final_score))
                enhanced_rec['improvement_suggestions'] = improvement_suggestions  # Add this line
                enhanced_rec['ml_reasons'] = []
                
                if cf_score is not None:
                    enhanced_rec['ml_reasons'].append(
                        f"Similar users with comparable academic profiles also showed interest in this career"
                    )
                
                if ap_score is not None and ap_score > original_score:
                    enhanced_rec['ml_reasons'].append(
                        f"Your academic performance pattern suggests strong compatibility with this career"
                    )
                
                enhanced_recommendations.append(enhanced_rec)
            
            # Sort by enhanced score
            enhanced_recommendations.sort(key=lambda x: x.get('ml_enhanced_score', 0), reverse=True)
            
            return {
                'success': True,
                'enhanced_recommendations': enhanced_recommendations,
                'ml_enhanced': True,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error enhancing recommendations: {str(e)}")
            return {
                'success': False,
                'enhanced_recommendations': recommendations,
                'ml_enhanced': False,
                'error': str(e)
            }
    
    def get_similar_careers(self, career_id, limit=5):
        """Get similar careers using ML"""
        try:
            self.cf_model.load_model()
            similar_careers = self.cf_model.get_similar_careers(career_id, limit)
            
            return {
                'success': True,
                'similar_careers': similar_careers
            }
            
        except Exception as e:
            self.logger.error(f"Error getting similar careers: {str(e)}")
            return {
                'success': False,
                'similar_careers': [],
                'error': str(e)
            }
    
    def predict_trends(self, historical_data):
        """Predict career trends (placeholder implementation)"""
        try:
            # Simple trend analysis based on recommendation frequency
            career_counts = {}
            
            for record in historical_data:
                for rec in record.get('recommendations', []):
                    career_id = str(rec.get('career', ''))
                    if career_id not in career_counts:
                        career_counts[career_id] = 0
                    career_counts[career_id] += 1
            
            # Sort by frequency
            sorted_careers = sorted(career_counts.items(), key=lambda x: x[1], reverse=True)
            
            trends = []
            for career_id, count in sorted_careers[:10]:
                trends.append({
                    'career_id': career_id,
                    'trend_score': count,
                    'prediction': 'increasing' if count > 5 else 'stable'
                })
            
            return {
                'success': True,
                'trends': trends
            }
            
        except Exception as e:
            self.logger.error(f"Error predicting trends: {str(e)}")
            return {
                'success': False,
                'trends': [],
                'error': str(e)
            }
    
    def health_check(self):
        """Check ML system health"""
        try:
            health_status = {
                'healthy': True,
                'status': 'operational',
                'components': {
                    'database': False,
                    'collaborative_filtering': False,
                    'academic_predictor': False
                },
                'timestamp': datetime.now().isoformat()
            }
            
            # Check database connection
            if self.db is not None:
                try:
                    self.client.admin.command('ping')
                    health_status['components']['database'] = True
                except:
                    pass
            
            # Check if models exist
            cf_model_exists = os.path.exists('./models/collaborative_filtering_model.pkl')
            ap_model_exists = os.path.exists('./models/academic_performance_models.pkl')
            
            health_status['components']['collaborative_filtering'] = cf_model_exists
            health_status['components']['academic_predictor'] = ap_model_exists
            
            # Overall health
            models_healthy = cf_model_exists or ap_model_exists
            health_status['healthy'] = models_healthy
            health_status['status'] = 'operational' if models_healthy else 'degraded'
            
            return health_status
            
        except Exception as e:
            return {
                'healthy': False,
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No command provided'}))
        sys.exit(1)
    
    command = sys.argv[1]
    service = MLIntegrationService()
    
    try:
        if command == 'train_models':
            result = service.train_models()
            print(json.dumps(result))
            
        elif command == 'enhance_recommendations':
            # Read input data from stdin
            input_data = json.loads(sys.stdin.read())
            user_data = input_data.get('user', {})
            recommendations = input_data.get('recommendations', [])
            
            result = service.enhance_recommendations(user_data, recommendations)
            print(json.dumps(result))
            
        elif command == 'similar_careers':
            career_id = sys.argv[2] if len(sys.argv) > 2 else ''
            limit = int(sys.argv[3]) if len(sys.argv) > 3 else 5
            
            result = service.get_similar_careers(career_id, limit)
            print(json.dumps(result))
            
        elif command == 'predict_trends':
            input_data = json.loads(sys.stdin.read())
            historical_data = input_data.get('historical_data', [])
            
            result = service.predict_trends(historical_data)
            print(json.dumps(result))
            
        elif command == 'health_check':
            result = service.health_check()
            print(json.dumps(result))
            
        else:
            print(json.dumps({'error': f'Unknown command: {command}'}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()
