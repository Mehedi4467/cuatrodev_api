export const getHomeData = (req,res) => {
    res.status(403).json({
        status: true,
        msg: 'Welcome to IT Commerce',
      });
}