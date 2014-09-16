<?php

namespace Me\PassionBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

use Me\PassionBundle\Entity\User;
use Me\PassionBundle\Entity\Annonce;

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

    public function submitAction(Request $request)
    {
        // TODO: need to figure out how to STOP recursion of entities, this will allow use of ORM
        // http://stackoverflow.com/questions/11851197/avoiding-recursion-with-doctrine-entities-and-jmsserializer

        //$repository = $this->getDoctrine()->getRepository('MePassionBundle:Annonce');
        //$entity = $repository->findOneById(1);
        //$serializedEntity = $this->container->get('serializer')->serialize($entity, 'json');
        //$requestObject = $this->container->get('serializer')->deserialize($request, 'Me\PassionBundle\Entity\Annonce', 'json');

        $content = $this->get("request")->getContent();
        if (!empty($content)){
            $params = json_decode($content);

            $em = $this->getDoctrine()->getManager();

            $user = $em->getRepository('MePassionBundle:User')->findOneByEmail($params->user->email);

            if(!$user){
                $newUser = new User();
                $newUser->setEmail($params->user->email);
                $newUser->setPassword(password_hash($params->user->password, PASSWORD_BCRYPT));
                $newUser->setContact($params->user->contact);

                $em->persist($newUser);
                $em->flush();
            }
            else{
                $user->setPassword(password_hash($params->user->password, PASSWORD_BCRYPT));
            }

            $annonce = new Annonce();
            $category = $this->container->get('serializer')->deserialize(json_encode($params->category), 'Me\PassionBundle\Entity\Category', 'json');
            $annonce->setCategory($category);
            $annonce->setTitre($params->titre);
            $annonce->setTexte($params->texte);
            $annonce->setPrix($params->prix);
            //$annonce->setPhoto()
            $annonce->setCodePostal($params->code);
            $annonce->setVille($params->ville);
            $annonce->setTel($params->tel);
            $annonce->setValidationCode(substr(md5(uniqid(mt_rand(), true)), 0, 8));

            if(!$user){
                $user = $em->getRepository('MePassionBundle:User')->findOneByEmail($params->user->email);
                $annonce->setUserId($user);
            }
            else{
                $annonce->setUserId($user);
            }

            $em->persist($annonce);
            $em->flush();
        }

        $response = new Response(json_encode($annonce));
        //$response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function indexAction()
    {
        return $this->render('MePassionBundle:Default:index.html.twig');
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
