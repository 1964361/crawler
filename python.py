import requests
from bs4 import BeautifulSoup

def simple_web_crawler(url, depth=3):
    visited_urls = set()

    def crawl(current_url, current_depth):
        if current_depth > depth or current_url in visited_urls:
            return

        print("Crawling:", current_url)

        try:
            response = requests.get(current_url)
            visited_urls.add(current_url)

            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')

                # Process the page content as needed
                # For example, you can extract links from the page
                links = [a.get('href') for a in soup.find_all('a', href=True)]

                for link in links:
                    # Build the absolute URL if it's a relative link
                    absolute_link = link if link.startswith('http') else f"{current_url}/{link}"

                    # Recursively crawl the next level
                    crawl(absolute_link, current_depth + 1)

        except Exception as e:
            print(f"Error crawling {current_url}: {e}")

    crawl(url, 1)

# Example usage:
start_url = 'https://example.com'
simple_web_crawler(start_url)
