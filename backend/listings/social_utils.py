import os
import requests
import logging

logger = logging.getLogger(__name__)

class MetaSocialManager:
    """
    Handles posting listings to Instagram and Facebook via Meta Graph API.
    """
    
    def __init__(self):
        self.access_token = os.getenv('META_ACCESS_TOKEN')
        self.instagram_account_id = os.getenv('META_INSTAGRAM_ACCOUNT_ID')
        self.facebook_page_id = os.getenv('META_FACEBOOK_PAGE_ID')
        self.graph_url = "https://graph.facebook.com/v19.0"

    def post_listing(self, listing_data):
        """
        Posts a listing to both Instagram and Facebook.
        returns: {'instagram': {'id': str, 'error': str}, 'facebook': {'id': str, 'error': str}}
        """
        results = {}
        
        caption = self._build_caption(listing_data)
        image_url = listing_data.get('images', [None])[0]
        
        if not image_url:
            return {'error': 'No image found for listing'}

        # Ensure image_url is full URL (Meta needs public URL)
        # If it's a relative path, we might need to prepend base URL 
        # (Assuming the system provides full URLs in the listing object now)

        # 1. Post to Instagram
        if self.instagram_account_id and self.access_token:
            results['instagram'] = self._post_to_instagram(image_url, caption)
        else:
            results['instagram'] = {'error': 'Instagram API not configured'}

        # 2. Post to Facebook
        if self.facebook_page_id and self.access_token:
            results['facebook'] = self._post_to_facebook(image_url, caption)
        else:
            results['facebook'] = {'error': 'Facebook API not configured'}
            
        return results

    def _build_caption(self, listing_data):
        """Builds a formatted caption for the post"""
        title = listing_data.get('title', 'New Listing')
        price = listing_data.get('price', '')
        address = listing_data.get('address', '')
        # Link to the listing on the website
        link = f"https://orangehousing.com/listings/{listing_data.get('id')}" 
        
        caption = f"🏠 {title}\n"
        if price: caption += f"💰 {price}\n"
        if address: caption += f"📍 {address}\n\n"
        caption += f"Check it out here: {link}\n\n"
        caption += "#OrangeHousing #SyracuseRentals #StudentHousing #SyracuseUniversity"
        
        return caption

    def _post_to_instagram(self, image_url, caption):
        """
        Instagram requires 2 steps: 
        1. Create a media container
        2. Publish the container
        """
        try:
            # Step 1: Create Container
            container_url = f"{self.graph_url}/{self.instagram_account_id}/media"
            container_payload = {
                'image_url': image_url,
                'caption': caption,
                'access_token': self.access_token
            }
            container_res = requests.post(container_url, data=container_payload)
            container_data = container_res.json()
            
            if 'id' not in container_data:
                return {'error': f"Container creation failed: {container_data.get('error', {}).get('message', 'Unknown error')}"}
            
            creation_id = container_data['id']
            
            # Step 2: Publish
            publish_url = f"{self.graph_url}/{self.instagram_account_id}/media_publish"
            publish_payload = {
                'creation_id': creation_id,
                'access_token': self.access_token
            }
            publish_res = requests.post(publish_url, data=publish_payload)
            publish_data = publish_res.json()
            
            if 'id' not in publish_data:
                return {'error': f"Publish failed: {publish_data.get('error', {}).get('message', 'Unknown error')}"}
                
            return {'id': publish_data['id']}
            
        except Exception as e:
            logger.error(f"Instagram posting error: {e}")
            return {'error': str(e)}

    def _post_to_facebook(self, image_url, caption):
        """Post photo to Facebook Page"""
        try:
            fb_url = f"{self.graph_url}/{self.facebook_page_id}/photos"
            payload = {
                'url': image_url,
                'caption': caption,
                'access_token': self.access_token
            }
            response = requests.post(fb_url, data=payload)
            data = response.json()
            
            if 'id' not in data:
                return {'error': f"FB posting failed: {data.get('error', {}).get('message', 'Unknown error')}"}
                
            return {'id': data['id']}
            
        except Exception as e:
            logger.error(f"Facebook posting error: {e}")
            return {'error': str(e)}
