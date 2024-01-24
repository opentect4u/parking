function useCalculateDuration(inTimestamp, outTimestamp) {
    let duration = '';
    const diffInMilliseconds = Math.abs(inTimestamp - outTimestamp);
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffInMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffInMinutes >= 60) {
      duration = `${diffHours} H ${diffInMinutes % 60} M`;
    } else {
      duration = `${diffInMinutes} minutes`;
    }

    if (diffHours >= 24) {
      duration = `${diffDays} D ${diffHours % 24} H ${diffInMinutes % 60 } M`;
      // duration = `${diffDays} D ${diffHours % 24} H ${diffInMinutes % 60 } M`;
    }

    return duration;
  }



  export default useCalculateDuration;
