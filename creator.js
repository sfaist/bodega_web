
class Creator {
  constructor() {
  }

  waitForMemberstack() {
    return new Promise((resolve) => {
      const checkMemberstack = () => {
        if (typeof window.$memberstackDom !== 'undefined') {
          resolve();
        } else {
          setTimeout(checkMemberstack, 50);
        }
      };
      checkMemberstack();
    });
  }

  async init() {
    await this.waitForMemberstack();
    const member = await window.$memberstackDom.getCurrentMember();
    const creator_handle = member.data.customFields.handle;

    const apiUrl = `https://api.onbodega.com/request`;
    const body = {"handle": creator_handle};
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
  
    const data = await response.json();
    this.name = data.name
    this.handle = creator_handle
    this.profile_picture = data.profile_picture
    this.followers = data.followers
  }
}
