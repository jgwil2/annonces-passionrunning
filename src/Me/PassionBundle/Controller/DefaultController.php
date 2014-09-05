<?php

namespace Me\PassionBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

use Me\PassionBundle\Entity\Category;

class DefaultController extends Controller
{
    public function annoncesDataAction()
    {
    	$conn = $this->get('database_connection');
    	$entity = $conn->fetchAll(
    		'SELECT Annonce.`id`, `titre`, `texte`, `prix`, `photo`, `code_postal`, `ville`, `tel`, `valid`, 
    		DATE_FORMAT(Annonce.`dateCreated`, \'%d/%m/%Y\') AS date,
    		DATE_FORMAT(Annonce.`dateCreated`, \'%H:%i\') AS time,
    		Category.name AS category, 
    		User.email AS user
    		FROM Annonce 
    		INNER JOIN Category 
    		ON Annonce.category_id = Category.id
    		INNER JOIN User
    		ON Annonce.user_id = User.id
    		AND Annonce.valid = 1');

    	$serializedEntity = $this->container->get('serializer')->serialize($entity, 'json');
    	$response = new Response($serializedEntity);
    	$response->headers->set('Content-Type', 'application/json');

    	return $response;
    }

    public function categoriesDataAction()
    {
        $conn = $this->get('database_connection');
        $entity = $conn->fetchAll(
            'SELECT * 
            FROM Category');

        $serializedEntity = $this->container->get('serializer')->serialize($entity, 'json');
        $response = new Response($serializedEntity);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function indexAction()
    {
        return $this->render('MePassionBundle:Default:index.html.twig');
    }

    public function submitAction(Request $request)
    {

    }

    public function myPostsAction()
    {

    }

    public function modifyAction()
    {

    }

    public function deactivateAction()
    {

    }
}
