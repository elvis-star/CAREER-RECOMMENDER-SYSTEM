import os
import pickle
import logging
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib

class CollaborativeFilteringModel:
    def __init__(self, model_path='./models'):
        self.model_path = model_path
        self.user_item_matrix = None
        self.item_similarity_matrix = None
        self.user_similarity_matrix = None
        self.nmf_model = None
        self.career_features = None
        self.user_features = None
        self.career_mapping = {}
        self.user_mapping = {}
        self.is_trained = False
        
        # Setup logging
        self.logger = logging.getLogger('CollaborativeFiltering')
        
        # Ensure model directory exists
        os.makedirs(model_path, exist_ok=True)
    
    def prepare_data(self, recommendations_data, careers_data):
        """Prepare data for collaborative filtering"""
        try:
            self.logger.info("Preparing data for collaborative filtering...")
            
            # Create career mapping
            self.career_mapping = {str(career['_id']): idx for idx, career in enumerate(careers_data)}
            career_id_to_title = {str(career['_id']): career.get('title', 'Unknown') for career in careers_data}
            
            # Prepare user-item interactions
            interactions = []
            users = set()
            
            for rec_data in recommendations_data:
                user_id = str(rec_data.get('user', ''))
                users.add(user_id)
                
                for rec in rec_data.get('recommendations', []):
                    career_id = str(rec.get('career', ''))
                    match_score = rec.get('match', 0)
                    
                    if career_id in self.career_mapping:
                        interactions.append({
                            'user_id': user_id,
                            'career_id': career_id,
                            'rating': match_score / 100.0  # Normalize to 0-1
                        })
            
            # Create user mapping
            self.user_mapping = {user_id: idx for idx, user_id in enumerate(sorted(users))}
            
            # Create user-item matrix
            n_users = len(self.user_mapping)
            n_careers = len(self.career_mapping)
            
            self.user_item_matrix = np.zeros((n_users, n_careers))
            
            for interaction in interactions:
                user_idx = self.user_mapping[interaction['user_id']]
                career_idx = self.career_mapping[interaction['career_id']]
                self.user_item_matrix[user_idx, career_idx] = interaction['rating']
            
            self.logger.info(f"Prepared matrix with {n_users} users and {n_careers} careers")
            return True
            
        except Exception as e:
            self.logger.error(f"Error preparing data: {str(e)}")
            return False
    
    def train_user_based_cf(self):
        """Train user-based collaborative filtering"""
        try:
            self.logger.info("Training user-based collaborative filtering...")
            
            if self.user_item_matrix is None:
                self.logger.error("No user-item matrix available")
                return False
            
            # Calculate user similarity matrix
            self.user_similarity_matrix = cosine_similarity(self.user_item_matrix)
            
            self.logger.info("User-based CF model trained successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Error training user-based CF: {str(e)}")
            return False
    
    def train_item_based_cf(self):
        """Train item-based collaborative filtering"""
        try:
            self.logger.info("Training item-based collaborative filtering...")
            
            if self.user_item_matrix is None:
                self.logger.error("No user-item matrix available")
                return False
            
            # Calculate item similarity matrix
            self.item_similarity_matrix = cosine_similarity(self.user_item_matrix.T)
            
            self.logger.info("Item-based CF model trained successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Error training item-based CF: {str(e)}")
            return False
    
    def train_matrix_factorization(self):
        """Train matrix factorization model"""
        try:
            self.logger.info("Training matrix factorization model...")
            
            if self.user_item_matrix is None:
                self.logger.error("No user-item matrix available")
                return False
            
            # Use NMF for matrix factorization
            n_components = min(10, min(self.user_item_matrix.shape) - 1)
            if n_components < 1:
                n_components = 1
            
            self.nmf_model = NMF(n_components=n_components, random_state=42)
            self.user_features = self.nmf_model.fit_transform(self.user_item_matrix)
            self.career_features = self.nmf_model.components_
            
            self.logger.info("Matrix factorization model trained successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Error training matrix factorization: {str(e)}")
            return False
    
    def get_user_recommendations(self, user_id, n_recommendations=10):
        """Get recommendations for a specific user"""
        try:
            if not self.is_trained:
                self.load_model()
            
            if user_id not in self.user_mapping:
                # Return empty recommendations for unknown users
                return []
            
            user_idx = self.user_mapping[user_id]
            
            # Get user's current ratings
            user_ratings = self.user_item_matrix[user_idx]
            
            # Find similar users
            user_similarities = self.user_similarity_matrix[user_idx]
            similar_users = np.argsort(user_similarities)[::-1][1:6]  # Top 5 similar users
            
            # Generate recommendations based on similar users
            recommendations = []
            career_scores = {}
            
            for similar_user_idx in similar_users:
                similarity_score = user_similarities[similar_user_idx]
                similar_user_ratings = self.user_item_matrix[similar_user_idx]
                
                for career_idx, rating in enumerate(similar_user_ratings):
                    if rating > 0 and user_ratings[career_idx] == 0:  # User hasn't rated this career
                        career_id = list(self.career_mapping.keys())[career_idx]
                        if career_id not in career_scores:
                            career_scores[career_id] = 0
                        career_scores[career_id] += similarity_score * rating
            
            # Sort and return top recommendations
            sorted_careers = sorted(career_scores.items(), key=lambda x: x[1], reverse=True)
            
            for career_id, score in sorted_careers[:n_recommendations]:
                recommendations.append({
                    'career_id': career_id,
                    'ml_enhanced_score': min(1.0, score),
                    'confidence': min(100, score * 100)
                })
            
            return recommendations
            
        except Exception as e:
            self.logger.error(f"Error getting user recommendations: {str(e)}")
            return []
    
    def get_similar_careers(self, career_id, n_similar=5):
        """Get careers similar to the given career"""
        try:
            if not self.is_trained:
                self.load_model()
            
            if career_id not in self.career_mapping:
                return []
            
            career_idx = self.career_mapping[career_id]
            
            if self.item_similarity_matrix is not None:
                # Use item-based similarity
                similarities = self.item_similarity_matrix[career_idx]
                similar_indices = np.argsort(similarities)[::-1][1:n_similar+1]
                
                similar_careers = []
                for idx in similar_indices:
                    similar_career_id = list(self.career_mapping.keys())[idx]
                    similarity_score = similarities[idx]
                    
                    similar_careers.append({
                        'career_id': similar_career_id,
                        'similarity_score': float(similarity_score)
                    })
                
                return similar_careers
            
            return []
            
        except Exception as e:
            self.logger.error(f"Error getting similar careers: {str(e)}")
            return []
    
    def save_model(self):
        """Save the trained model"""
        try:
            model_data = {
                'user_item_matrix': self.user_item_matrix,
                'item_similarity_matrix': self.item_similarity_matrix,
                'user_similarity_matrix': self.user_similarity_matrix,
                'nmf_model': self.nmf_model,
                'career_features': self.career_features,
                'user_features': self.user_features,
                'career_mapping': self.career_mapping,
                'user_mapping': self.user_mapping,
                'is_trained': True
            }
            
            model_file = os.path.join(self.model_path, 'collaborative_filtering_model.pkl')
            joblib.dump(model_data, model_file)
            
            self.is_trained = True
            self.logger.info(f"Model saved to {model_file}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error saving model: {str(e)}")
            return False
    
    def load_model(self):
        """Load the trained model"""
        try:
            model_file = os.path.join(self.model_path, 'collaborative_filtering_model.pkl')
            
            if not os.path.exists(model_file):
                self.logger.warning("Model file not found")
                return False
            
            model_data = joblib.load(model_file)
            
            self.user_item_matrix = model_data.get('user_item_matrix')
            self.item_similarity_matrix = model_data.get('item_similarity_matrix')
            self.user_similarity_matrix = model_data.get('user_similarity_matrix')
            self.nmf_model = model_data.get('nmf_model')
            self.career_features = model_data.get('career_features')
            self.user_features = model_data.get('user_features')
            self.career_mapping = model_data.get('career_mapping', {})
            self.user_mapping = model_data.get('user_mapping', {})
            self.is_trained = model_data.get('is_trained', False)
            
            self.logger.info("Model loaded successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Error loading model: {str(e)}")
            return False
