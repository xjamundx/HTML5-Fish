function Smasher() {}

Smasher.detectCollision = function(collissionBoundary1, collissionBoundary2) {
	// collissionBoundary1.draw();
	// collissionBoundary2.draw();

	return (
			(
				(collissionBoundary1.x + collissionBoundary1.width > collissionBoundary2.x)
			&&
				(collissionBoundary1.x < collissionBoundary2.x + collissionBoundary2.width)
			&&	
				(
					(
						(collissionBoundary1.y < collissionBoundary2.y + collissionBoundary2.height) 
					&&
						(collissionBoundary1.y > collissionBoundary2.y)
					)
				||
					(
						(collissionBoundary1.y  + collissionBoundary1.height < collissionBoundary2.y + collissionBoundary2.height) 
					&&
						(collissionBoundary1.y  + collissionBoundary1.height > collissionBoundary2.y)
					)
				)
			)
	)
}
